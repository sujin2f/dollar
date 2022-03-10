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

type GetItemsParam = {
    year: number
    month: number
}
export const getItems = async (
    { year, month }: GetItemsParam,
    { session: { user } }: Request,
): Promise<Item[]> => {
    if (!year && !month) {
        return []
    }

    return await ItemModel.find({
        user,
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

type AddItemsParam = {
    items: RawItem[]
}
export const addItems = async (
    { items }: AddItemsParam,
    { session: { user } }: Request,
): Promise<boolean> => {
    for (const item of items) {
        const category = item.category
            ? await findOrCreateCategory(item.category, user).catch(() => {
                  throw new Error(ErrorMessages.FIND_CATEGORIES_FAILED)
              })
            : undefined

        if (category) {
            await findOrCreatePreSelect(item.originTitle, category, user)
        }

        const itemModel = new ItemModel({
            ...item,
            user,
            category: category ? category._id : undefined,
        })
        await itemModel.save().catch(() => {
            throw new Error(ErrorMessages.CREATE_ITEM_FAILED)
        })
    }

    return true
}

type DeleteItemParam = {
    _id: string
}
export const deleteItem = async (
    { _id }: DeleteItemParam,
    { session: { user } }: Request,
): Promise<boolean> => {
    return await ItemModel.deleteOne({
        _id,
        user,
    })
        .then(() => true)
        .catch(() => false)
}

type UpdateItemParam = {
    item: RawItem
}
export const updateItem = async (
    { item }: UpdateItemParam,
    { session: { user } }: Request,
): Promise<boolean> => {
    const category = item.category
        ? await findOrCreateCategory(item.category, user).catch(() => {
              throw new Error(ErrorMessages.FIND_CATEGORIES_FAILED)
          })
        : undefined

    return await ItemModel.updateOne(
        {
            _id: item._id,
            user,
        },
        {
            ...item,
            category: category ? category._id : undefined,
        },
    )
        .then(() => true)
        .catch(() => false)
}
