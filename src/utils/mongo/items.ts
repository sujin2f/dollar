import mongoose, { Schema } from 'mongoose'
import { ErrorMessages } from 'src/constants'
import { Item } from 'src/types'
import { createOrGetCategory, CategoryModel } from '.'
import { currencyToNumber } from '../string'

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
            ? await createOrGetCategory(row.category, userId)
            : null
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

// export const removeItem = async (
//     _id: string,
//     userId?: string,
// ): Promise<boolean> => {
//     const cacheKey = `getItems-${userId}`
//     cache.del(cacheKey)

//     const item = await ItemsModel.findOne({ _id })
//     if (!item) {
//         throw new Error(ErrorMessages.REMOVE_ITEM_FAILED)
//     }
//     if (userId && item.userId && item.userId.toString() !== userId.toString()) {
//         throw new Error(ErrorMessages.REMOVE_ITEM_FAILED)
//     }
//     const result = await ItemsModel.deleteOne({ _id })
//     if (result.deletedCount > 0) {
//         return true
//     }

//     throw new Error(ErrorMessages.REMOVE_ITEM_FAILED)
// }
