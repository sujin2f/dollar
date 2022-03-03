import mongoose, { Schema } from 'mongoose'
import { ErrorMessages } from 'src/constants'
import { Column, CreateItemsParam, Item, Nullable } from 'src/types'
import {
    findOrCreateCategory,
    CategoryModel,
    getPreSelect,
    findOrCreatePreSelect,
} from 'src/utils/mongo'
import { currencyToNumber } from 'src/utils'

const itemSchema = new Schema({
    date: Date,
    title: String,
    originTitle: String,
    debit: Number,
    credit: Number,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'category',
        required: false,
    },
})

const ItemModel = mongoose.model<Item>('item', itemSchema)

// TODO get duration and cache
export const getItems = async (userId?: string): Promise<Item[]> => {
    if (!userId) {
        throw new Error(ErrorMessages.AUTHENTICATION_FAILED)
    }

    return await ItemModel.find({ user: userId })
        .sort({ date: -1 })
        .populate({ path: 'category', model: CategoryModel })
        .then((items) => {
            if (!items) {
                throw new Error(ErrorMessages.FIND_ITEM_FAILED)
            }
            return items
        })
        .catch(() => {
            throw new Error(ErrorMessages.FIND_ITEM_FAILED)
        })
}

export const createItems = async (
    json: string,
    userId?: string,
): Promise<boolean> => {
    if (!userId) {
        throw new Error(ErrorMessages.AUTHENTICATION_FAILED)
    }

    const parsed = JSON.parse(json.replaceAll("'", '"'))

    for (const row of parsed) {
        const category = row.category
            ? await findOrCreateCategory(row.category, userId).catch(() => {
                  throw new Error(ErrorMessages.FIND_CATEGORIES_FAILED)
              })
            : null

        if (category) {
            await findOrCreatePreSelect(row.originTitle, category._id, userId)
        }
        const item = {
            ...row,
            date: new Date(row.date),
            user: userId,
            category: category?._id,
            debit: currencyToNumber(row.debit),
            credit: currencyToNumber(row.credit),
        }
        const itemModel = new ItemModel(item)
        await itemModel.save().catch(() => {
            throw new Error(ErrorMessages.CREATE_ITEM_FAILED)
        })
    }

    return true
}

export const getPreItems = async (
    rawText: string,
    dateFormat: string,
    userId?: string,
): Promise<CreateItemsParam[]> => {
    if (!userId) {
        throw new Error(ErrorMessages.AUTHENTICATION_FAILED)
    }

    const dataset = rawTextToDataSet(rawText, dateFormat)
    for (const [index, datarow] of dataset.entries()) {
        // Check the pre-input item matches to a new row
        await ItemModel.findOne({
            user: userId,
            date: datarow.date,
            originalTitle: datarow.title,
            debit: currencyToNumber(datarow.debit),
            credit: currencyToNumber(datarow.credit),
        }).then((item) => {
            if (item) {
                dataset[index].checked = false
            }
        })

        // Check the preSelect to get the category
        const preSelect = await getPreSelect(datarow.title, userId).catch(
            () => null,
        )
        if (preSelect && preSelect.category) {
            dataset[index].category = preSelect.category.title
        }
    }

    return dataset
}

const rawTextToDataSet = (
    rawText: string,
    dateFormat: string,
): CreateItemsParam[] => {
    const tabSeparated = rawText
        .split('[line-break]')
        .map((row) => row.split('\t'))
    const columns: Column[] = []
    const result = []

    // Set columns with the first row
    if (!tabSeparated[0][0]) {
        return []
    }

    tabSeparated[0].forEach((text) => {
        if (Object.keys(Column).includes(text)) {
            columns.push(Column[text as keyof typeof Column])
        } else {
            columns.push(Column.Unknown)
        }
    })

    // Put data into result
    for (const row of tabSeparated.splice(1)) {
        const rowData: Partial<Record<Column, string>> = {}
        row.forEach((column, key) => (rowData[columns[key]] = column))
        result.push(rowData)
    }

    return result
        .map((row) => {
            let date: Nullable<Date> = null
            switch (dateFormat) {
                case 'DD/MM/YYYY':
                    const dateString = row[Column.Date]?.split('/') || []
                    if (dateString.length !== 3) {
                        break
                    }
                    date = new Date(
                        `${dateString[2]}-${dateString[1]}-${dateString[0]}`,
                    )
                    break
                default:
                    date = new Date(Date.parse(row[Column.Date] || ''))
            }
            return {
                checked: true,
                date,
                title: row[Column.Title],
                originTitle: row[Column.Title],
                category: '',
                debit: row[Column.Debit],
                credit: row[Column.Credit],
            } as CreateItemsParam
        })
        .filter((row) => {
            const dateValid =
                !row.date || row.date.toString() !== 'Invalid Date'
            if (!dateValid) {
                return false
            }
            return row.debit || row.credit
        })
}
