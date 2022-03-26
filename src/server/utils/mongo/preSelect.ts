import { Request } from 'express'
import mongoose, { Schema } from 'mongoose'
import { RawItemsParam } from 'src/constants/graph-query'
import { PreSelect, Category, RawItem } from 'src/types/model'
import { deepCopy } from 'src/utils/array'
import { toMongoSearchString } from 'src/utils/string'
import { CategoryModel } from './categories'
import { ItemModel } from './items'

const preSelectSchema = new Schema({
    title: String,
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
preSelectSchema.index({ title: 'text' })

export const PreSelectModel = mongoose.model<PreSelect>(
    'preSelect',
    preSelectSchema,
)

export const findOrCreatePreSelect = async (
    keyword: string,
    category: Category,
    user: string,
): Promise<boolean> => {
    const $search = toMongoSearchString(keyword)

    return await PreSelectModel.findOne({
        user,
        category: category._id,
        $text: { $search },
    })
        .populate({ path: 'category', model: CategoryModel })
        .then(async (preSelect) => {
            if (!preSelect) {
                const preSelectModel = new PreSelectModel({
                    user,
                    category: category._id,
                    title: $search,
                })
                await preSelectModel
                    .save()
                    .catch(/* istanbul ignore next */ () => false)

                return true
            }

            const title = toMongoSearchString(`${preSelect.title} ${$search}`)
            await PreSelectModel.updateOne(
                {
                    _id: preSelect._id,
                },
                {
                    title,
                },
            ).catch(/* istanbul ignore next */ () => false)

            return true
        })
        .catch(/* istanbul ignore next */ () => false)
}

export const getRawItems = async (
    { rawItems }: RawItemsParam,
    { session: { user } }: Request,
): Promise<RawItem[]> => {
    const items = deepCopy(rawItems)
    for (const [index, item] of rawItems.entries()) {
        /**
         * Change category from pre-select
         */
        const $search = toMongoSearchString(item.originTitle)

        await PreSelectModel.findOne(
            {
                user,
                $text: { $search },
            },
            { score: { $meta: 'textScore' } },
        )
            .sort({ score: { $meta: 'textScore' } })
            .populate({ path: 'category', model: CategoryModel })
            .then((response) => {
                if (!response) {
                    return
                }
                items[index].category = response.category.title
            })
            .catch(
                /* istanbul ignore next */ () => {
                    return
                },
            )

        /**
         * Uncheck duplication
         */
        await ItemModel.findOne({
            user,
            title: item.originTitle,
            date: item.date,
        })
            .then((response) => {
                if (!response) {
                    return
                }
                items[index].checked = false
            })
            .catch(
                /* istanbul ignore next */ () => {
                    return
                },
            )
    }
    return items
}
