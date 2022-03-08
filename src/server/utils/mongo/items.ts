import mongoose, { Schema } from 'mongoose'
import { ErrorMessages } from 'src/server/constants/messages'
import {
    findOrCreateCategory,
    getPreSelect,
    findOrCreatePreSelect,
} from 'src/server/utils/mongo'
import { Item, CreateItemsParam } from 'src/types/model'
import { currencyToNumber, addZero, formatDate } from 'src/utils'
import { rawTextToCreateItemsParams } from '../create-items-params'
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
    userId: string,
    year: number,
    month: number,
): Promise<Item[]> => {
    return await ItemModel.find({
        user: userId,
        date: {
            $gte: `${year}-${addZero(month)}-01`,
            $lte: `${year}-${addZero(month)}-31`,
        },
    })
        .sort({ date: -1 })
        .populate({ path: 'category', model: CategoryModel })
        .catch(() => {
            throw new Error(ErrorMessages.FIND_ITEM_FAILED)
        })
}

export const createItems = async (
    userId: string,
    json: string,
    setPreSelect: boolean,
): Promise<boolean> => {
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
    userId: string,
    itemId: string,
): Promise<boolean> => {
    return await ItemModel.deleteOne({ _id: itemId })
        .then(() => true)
        .catch(() => false)
}

export const getPreItems = async (
    userId: string,
    rawText: string,
    dateFormat: string,
): Promise<CreateItemsParam[]> => {
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
