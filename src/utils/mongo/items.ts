import { ErrorMessages } from 'src/constants'
import { Column, CreateItemsParam, Item, Nullable } from 'src/types'
import {
    findOrCreateCategories,
    getPreSelect,
    findOrCreatePreSelect,
} from 'src/utils/mongo'
import { currencyToNumber, addZero, formatDate } from 'src/utils'
import { ItemModel, CategoryModel } from 'src/constants/mongo'

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
        .populate({ path: 'categories', model: CategoryModel })
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
    userId?: string,
): Promise<boolean> => {
    if (!userId) {
        throw new Error(ErrorMessages.AUTHENTICATION_FAILED)
    }

    const parsed = JSON.parse(json.replaceAll("'", '"')) as CreateItemsParam[]
    for (const row of parsed) {
        const categories = row.categories
            ? await findOrCreateCategories(row.categories, userId).catch(() => {
                  throw new Error(ErrorMessages.FIND_CATEGORIES_FAILED)
              })
            : []
        if (categories.length) {
            await findOrCreatePreSelect(row.originTitle, categories, userId)
        }
        const item = {
            ...row,
            date: formatDate(row.date),
            user: userId,
            categories,
            debit: currencyToNumber(row.debit || ''),
            credit: currencyToNumber(row.credit || ''),
        }
        const itemModel = new ItemModel(item)
        await itemModel.save().catch(() => {
            throw new Error(ErrorMessages.CREATE_ITEM_FAILED)
        })
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
        if (preSelect && preSelect.categories) {
            createItemsParams[index].categories = preSelect.categories.map(
                (c) => c.title,
            )
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
                categories: [],
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
