import { Request } from 'express'
import mongoose, { Schema } from 'mongoose'
import { PipelineStage } from 'mongoose'
import { TableType } from 'src/constants/accountBook'
import { ErrorMessages } from 'src/server/constants/messages'
import {
    mustGetCategoryByString,
    findOrCreatePreSelect,
} from 'src/server/utils/mongo'
import { Item, RawItem } from 'src/types/model'
import { addZero, yyyyMmDdToDate } from 'src/utils/datetime'
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

type AddItemParam = {
    item: RawItem
}
export const addItem = async <T extends string | number>(
    { item }: AddItemParam,
    { session: { user } }: Request,
    preSelect?: boolean,
    returnType?: T,
): Promise<T> => {
    const category =
        item.category &&
        (await mustGetCategoryByString(
            user,
            item.category,
            item.subCategory,
        ).catch((e) => {
            throw e
        }))

    if (category && preSelect) {
        await findOrCreatePreSelect(item.originTitle, category, user)
    }

    item._id = undefined
    const newItem = { ...item }
    delete newItem._id
    const itemModel = new ItemModel({
        ...newItem,
        user,
        category,
    })
    await itemModel.save().catch(
        /* istanbul ignore next */ () => {
            throw new Error(ErrorMessages.CREATE_ITEM_FAILED)
        },
    )

    // Redirection
    const date = yyyyMmDdToDate(item.date)
    const year = date.getFullYear()
    const month = date.getMonth() + 1

    if (!returnType || typeof returnType === 'string') {
        return `/app/${TableType.Daily}/${year}/${month}` as T
    }

    return new Date(item.date).getTime() as T
}

type AddItemsParam = {
    items: RawItem[]
}
export const addItems = async (
    { items }: AddItemsParam,
    request: Request,
): Promise<string> => {
    const dates: number[] = []
    for (const item of items) {
        dates.push(await addItem({ item }, request, true, 123))
    }
    dates.sort((a, b) => a - b)

    // Redirection
    const date = new Date(dates.pop() || 0)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    return `/app/${TableType.Daily}/${year}/${month}`
}

type GetItemsParam = {
    year: number
    month: number
    type: TableType
}
export const getItems = async (
    { year, month, type }: GetItemsParam,
    { session: { user } }: Request,
): Promise<Item[]> => {
    if (type === TableType.Daily) {
        return await ItemModel.find({
            user,
            date: {
                $gte: `${year}-${addZero(month)}-01`,
                $lte: `${year}-${addZero(month)}-31`,
            },
        })
            .sort({ date: -1 })
            .populate({ path: 'category', model: CategoryModel })
            .catch(
                /* istanbul ignore next */ () => {
                    throw new Error(ErrorMessages.FIND_ITEM_FAILED)
                },
            )
    }

    const stage: PipelineStage[] = [
        {
            $addFields: {
                month: {
                    $substr:
                        type === TableType.Monthly
                            ? ['$date', 0, 7]
                            : ['$date', 0, 4],
                },
            },
        },
        {
            $addFields: {
                idx: {
                    $concat: [
                        {
                            $ifNull: [
                                { $toString: '$category' },
                                'no-category',
                            ],
                        },
                        '-',
                        '$month',
                    ],
                },
            },
        },
    ]

    if (type === TableType.Monthly) {
        stage.push({
            $match: {
                date: {
                    $gte: `${year}-01-01`,
                    $lte: `${year}-12-31`,
                },
            },
        })
    }

    stage.push(
        {
            $group: {
                _id: '$idx',
                debit: {
                    $sum: '$debit',
                },
                credit: {
                    $sum: '$credit',
                },
                date: { $first: '$month' },
                title: { $first: '$category' },
            },
        },
        {
            $sort: {
                date: 1,
            },
        },
    )

    return await ItemModel.aggregate(stage).catch(
        /* istanbul ignore next */ () => {
            throw new Error(ErrorMessages.FIND_ITEM_FAILED)
        },
    )
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
        .catch(/* istanbul ignore next */ () => false)
}

type UpdateItemParam = {
    item: RawItem
}
export const updateItem = async (
    { item }: UpdateItemParam,
    { session: { user } }: Request,
): Promise<boolean> => {
    const category =
        item.category &&
        (await mustGetCategoryByString(
            user,
            item.category,
            item.subCategory,
        ).catch(
            /* istanbul ignore next */ (e) => {
                throw e
            },
        ))

    return await ItemModel.updateOne(
        {
            _id: item._id,
            user,
        },
        {
            ...item,
            category,
        },
    )
        .then(() => true)
        .catch(/* istanbul ignore next */ () => false)
}
