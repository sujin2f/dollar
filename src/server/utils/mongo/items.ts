import { Request } from 'express'
import mongoose, { Schema } from 'mongoose'
import { ErrorMessages } from 'src/server/constants/messages'
import {
    findOrCreateCategory,
    findOrCreatePreSelect,
} from 'src/server/utils/mongo'
import { Item, RawItem } from 'src/types/model'
import { addZero } from 'src/utils'
import { CategoryModel } from './categories'

declare module 'express-session' {
    interface Session {
        user?: string
    }
}

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
type GetItemsParam = {
    year: number
    month: number
}
export const getItems = async (
    param: GetItemsParam,
    req: Request,
): Promise<Item[]> => {
    if (!param.year && !param.month) {
        return []
    }

    return await ItemModel.find({
        user: req.session.user,
        date: {
            $gte: `${param.year}-${addZero(param.month)}-01`,
            $lte: `${param.year}-${addZero(param.month)}-31`,
        },
    })
        .sort({ date: -1 })
        .populate({ path: 'category', model: CategoryModel })
        .catch(() => {
            throw new Error(ErrorMessages.FIND_ITEM_FAILED)
        })
}

type AddItemsParam = {
    items: RawItem[]
}
export const addItems = async (
    param: AddItemsParam,
    req: Request,
): Promise<boolean> => {
    for (const item of param.items) {
        const category = item.category
            ? await findOrCreateCategory(item.category, req.session.user).catch(
                  () => {
                      throw new Error(ErrorMessages.FIND_CATEGORIES_FAILED)
                  },
              )
            : undefined

        if (category) {
            await findOrCreatePreSelect(
                item.originTitle,
                category,
                req.session.user,
            )
        }

        const itemModel = new ItemModel({
            ...item,
            user: req.session.user,
            category: category ? category._id : undefined,
        })
        await itemModel.save().catch(() => {
            throw new Error(ErrorMessages.CREATE_ITEM_FAILED)
        })
    }

    return true
}

type RemoveItemParam = {
    _id: string
}
export const removeItem = async (
    param: RemoveItemParam,
    req: Request,
): Promise<boolean> => {
    return await ItemModel.deleteOne({
        _id: param._id,
        user: req.session.user,
    })
        .then(() => true)
        .catch(() => false)
}
