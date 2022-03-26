import { Request } from 'express'
import mongoose, { Schema } from 'mongoose'
import { PipelineStage } from 'mongoose'
import { TableType } from 'src/constants/accountBook'
import { ItemParam, ItemsParam } from 'src/constants/graph-query'
import { ErrorMessages } from 'src/server/constants/messages'
import {
    mustGetCategoryByString,
    findOrCreatePreSelect,
} from 'src/server/utils/mongo'
import { Item } from 'src/types/model'
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

export const addItem = async <T extends string | number>(
    { rawItem }: ItemParam,
    { session: { user } }: Request,
    preSelect?: boolean,
    returnType?: T,
): Promise<T> => {
    const category =
        rawItem.category &&
        (await mustGetCategoryByString(
            user,
            rawItem.category,
            rawItem.subCategory,
        ).catch((e) => {
            throw e
        }))

    if (category && preSelect) {
        await findOrCreatePreSelect(rawItem.originTitle, category, user)
    }

    rawItem._id = undefined
    const newItem = { ...rawItem }
    delete newItem._id
    const itemModel = new ItemModel({
        ...newItem,
        user,
        category: category || undefined,
    } as Item)
    await itemModel.save().catch(
        /* istanbul ignore next */ () => {
            throw new Error('🤬 Cannot create an item.')
        },
    )

    // Redirection
    const date = yyyyMmDdToDate(rawItem.date)
    const year = date.getFullYear()
    const month = date.getMonth() + 1

    if (!returnType || typeof returnType === 'string') {
        return `/app/${TableType.Daily}/${year}/${month}` as T
    }

    return new Date(rawItem.date).getTime() as T
}

export const addItems = async (
    { rawItems }: ItemsParam,
    request: Request,
): Promise<string> => {
    const dates: number[] = []
    for (const rawItem of rawItems) {
        dates.push(await addItem({ rawItem }, request, true, 123))
    }
    dates.sort((a, b) => a - b)

    // Redirection
    const date = new Date(dates.pop() || 0)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    return `/app/${TableType.Daily}/${year}/${month}`
}

export const getItems = async (
    { year, month, type }: ItemsParam,
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

export const deleteItem = async (
    { rawItem }: ItemParam,
    { session: { user } }: Request,
): Promise<boolean> => {
    return await ItemModel.deleteOne({
        _id: rawItem._id,
        user,
    })
        .then(() => true)
        .catch(/* istanbul ignore next */ () => false)
}

export const updateItem = async (
    { rawItem }: ItemParam,
    { session: { user } }: Request,
): Promise<boolean> => {
    const category =
        rawItem.category &&
        (await mustGetCategoryByString(
            user,
            rawItem.category,
            rawItem.subCategory,
        ).catch(
            /* istanbul ignore next */ (e) => {
                throw e
            },
        ))

    const updateSet = category
        ? { ...rawItem, category }
        : [{ $set: { ...rawItem } }, { $unset: ['category'] }]

    return await ItemModel.updateOne(
        {
            _id: rawItem._id,
            user,
        },
        updateSet,
    )
        .then(() => true)
        .catch(
            /* istanbul ignore next */ (e) => {
                throw e
            },
        )
}
