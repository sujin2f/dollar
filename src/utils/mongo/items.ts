import mongoose, { Schema } from 'mongoose'
import { ErrorMessages } from 'src/constants'
import { Item } from 'src/types'
import { cache } from 'src/utils'

const itemsSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: false,
    },
    title: {
        type: String,
        required: true,
    },
    expiration: {
        type: String,
        required: true,
    },
})

const ItemsModel = mongoose.model<Item>('item', itemsSchema)

export const getItems = async (userId?: string): Promise<Item[]> => {
    const cacheKey = `getItems-${userId}`
    const cached = cache.get<Item[]>(cacheKey)
    if (cached) {
        return cached
    }
    return await ItemsModel.find({ userId })
        .sort([['expiration', 1]])
        .then((items) => {
            if (!items) {
                throw new Error(ErrorMessages.FIND_ITEM_FAILED)
            }
            cache.set<Item[]>(cacheKey, items)
            return items
        })
        .catch(() => {
            throw new Error(ErrorMessages.FIND_ITEM_FAILED)
        })
}

export const createItem = async (
    title: string,
    expiration: string,
    userId?: string,
): Promise<Item> => {
    const cacheKey = `getItems-${userId}`
    cache.del(cacheKey)

    const item = {
        userId,
        title,
        expiration,
    }
    const itemModel = new ItemsModel(item)

    return await itemModel.save().catch(() => {
        throw new Error(ErrorMessages.CREATE_ITEM_FAILED)
    })
}

export const removeItem = async (
    _id: string,
    userId?: string,
): Promise<boolean> => {
    const cacheKey = `getItems-${userId}`
    cache.del(cacheKey)

    const item = await ItemsModel.findOne({ _id })
    if (!item) {
        throw new Error(ErrorMessages.REMOVE_ITEM_FAILED)
    }
    if (userId && item.userId && item.userId.toString() !== userId.toString()) {
        throw new Error(ErrorMessages.REMOVE_ITEM_FAILED)
    }
    const result = await ItemsModel.deleteOne({ _id })
    if (result.deletedCount > 0) {
        return true
    }

    throw new Error(ErrorMessages.REMOVE_ITEM_FAILED)
}
