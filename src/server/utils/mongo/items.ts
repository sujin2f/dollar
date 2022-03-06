import mongoose, { Schema } from 'mongoose'
import { ErrorMessages } from 'src/constants'
import { Column, CreateItemsParam, Item, Nullable } from 'src/types'
import {
    findOrCreateCategory,
    getPreSelect,
    findOrCreatePreSelect,
} from 'src/server/utils/mongo'
import { currencyToNumber, addZero, formatDate } from 'src/utils'
import { CategoryModel } from './categories'

const itemSchema = new Schema({
    date: String,
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

export const ItemModel = mongoose.model<Item>('item', itemSchema)

// TODO get duration and cache
export const getItems = async (
    year: number,
    month: number,
    userId?: string,
): Promise<Item[]> => {
    if (!userId) {
        throw new Error(ErrorMessages.AUTHENTICATION_FAILED)
    }

    return await ItemModel.find({
        user: userId,
        date: {
            $gte: `${year}-${addZero(month)}-01`,
            $lte: `${year}-${addZero(month)}-31`,
        },
    })
        .sort({ date: -1 })
        .populate({ path: 'category', model: CategoryModel })
        .then((items) => {
            if (!items) {
                return []
            }
            return items
        })
        .catch((e: Error) => {
            console.error(e.message)
            throw new Error(`${ErrorMessages.FIND_ITEM_FAILED}: ${e.message}`)
        })
}

export const createItems = async (
    json: string,
    setPreSelect: boolean,
    userId?: string,
): Promise<boolean> => {
    if (!userId) {
        throw new Error(ErrorMessages.AUTHENTICATION_FAILED)
    }

    const parsed = JSON.parse(json.replaceAll("'", '"')) as CreateItemsParam[]
    for (const row of parsed) {
        const category = row.category
            ? await findOrCreateCategory(row.category, userId).catch(() => {
                  throw new Error(ErrorMessages.FIND_CATEGORIES_FAILED)
              })
            : undefined
        if (category && setPreSelect) {
            await findOrCreatePreSelect(row.originTitle, category, userId)
        }
        const item = {
            ...row,
            date: formatDate(row.date),
            user: userId,
            category: category ? category._id : undefined,
            debit: currencyToNumber(row.debit || ''),
            credit: currencyToNumber(row.credit || ''),
        }

        if (!row._id) {
            const itemModel = new ItemModel(item)
            await itemModel.save().catch(() => {
                throw new Error(ErrorMessages.CREATE_ITEM_FAILED)
            })
            continue
        }

        await ItemModel.updateOne(
            {
                _id: row._id,
            },
            {
                user: userId,
                date: row.date,
                title: row.title,
                category: category ? category._id : undefined,
                debit: currencyToNumber(row.debit || ''),
                credit: currencyToNumber(row.credit || ''),
            },
        )
    }

    return true
}

export const deleteItem = async (
    itemId: string,
    userId?: string,
): Promise<boolean> => {
    if (!userId) {
        throw new Error(ErrorMessages.AUTHENTICATION_FAILED)
    }
    return await ItemModel.deleteOne({ _id: itemId })
        .then(() => true)
        .catch(() => false)
}

export const getPreItems = async (
    rawText: string,
    dateFormat: string,
    userId?: string,
): Promise<CreateItemsParam[]> => {
    if (!userId) {
        throw new Error(ErrorMessages.AUTHENTICATION_FAILED)
    }

    const createItemsParams = rawTextToCreateItemsParams(rawText, dateFormat)
    for (const [index, item] of createItemsParams.entries()) {
        // Check the pre-input item matches to a new row
        await ItemModel.findOne({
            user: userId,
            date: item.date,
            originalTitle: item.title,
            debit: currencyToNumber(item.debit || ''),
            credit: currencyToNumber(item.credit || ''),
        })
            .then((itemFound) => {
                if (itemFound) {
                    createItemsParams[index].checked = false
                }
            })
            .catch((e: Error) => {
                console.error(
                    `${ErrorMessages.FIND_PRE_ITEM_FAILED}: ${e.message}`,
                )
                return
            })

        // Check the preSelect to get the category
        const preSelect = await getPreSelect(item.title, userId).catch(
            () => null,
        )
        if (preSelect && preSelect.category) {
            createItemsParams[index].category = preSelect.category.title
        }
    }

    return createItemsParams
}

const rawTextToCreateItemsParams = (
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
            let date: Nullable<string> = null
            switch (dateFormat) {
                case 'DD/MM/YYYY':
                    const dateString = row[Column.Date]?.split('/') || []
                    if (dateString.length !== 3) {
                        break
                    }
                    date = `${dateString[2]}-${addZero(
                        dateString[1],
                    )}-${addZero(dateString[0])}`
                    break
                default:
                    date = formatDate(row[Column.Date] || '')
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
