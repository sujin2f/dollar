import mongoose, { Schema } from 'mongoose'
import { ErrorMessages } from 'src/constants'
import { Category, PreSelect } from 'src/types'
import { CategoryModel } from './categories'

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
    userId?: string,
): Promise<boolean> => {
    if (!userId) {
        throw new Error(ErrorMessages.AUTHENTICATION_FAILED)
    }

    const title = keyword
        .replace(/[^a-zA-Z]/g, ' ')
        .toLowerCase()
        .split(' ')
        .filter((v) => v)
    const unique = [...new Set(title)]

    return await PreSelectModel.findOne({
        user: userId,
        category: category._id,
        $text: { $search: unique.join(' ') },
    })
        .populate({ path: 'category', model: CategoryModel })
        .then(async (preSelect) => {
            if (!preSelect) {
                const preSelectModel = new PreSelectModel({
                    user: userId,
                    category: category._id,
                    title: unique.join(' '),
                })
                await preSelectModel.save().catch((e: Error) => {
                    throw new Error(
                        `${ErrorMessages.CREATE_PRE_SELECT_FAILED}: ${e.message}`,
                    )
                })

                return true
            }

            const newTitle = `${preSelect.title} ${unique.join(' ')}`
                .split(' ')
                .filter((v) => v)
            const newUnique = [...new Set(newTitle)]
            await PreSelectModel.updateOne(
                {
                    _id: preSelect._id,
                },
                {
                    title: newUnique.join(' '),
                },
            ).catch((e: Error) => {
                throw new Error(
                    `${ErrorMessages.UPDATE_PRE_SELECT_FAILED}: ${e.message}`,
                )
            })

            return true
        })
        .catch((e: Error) => {
            throw new Error(`findOrCreatePreSelect: ${e.message}`)
        })
}

export const getPreSelect = async (
    keyword: string,
    userId?: string,
): Promise<PreSelect> => {
    if (!userId) {
        throw new Error(ErrorMessages.AUTHENTICATION_FAILED)
    }

    const title = keyword
        .replace(/[^a-zA-Z]/g, ' ')
        .toLowerCase()
        .split(' ')
        .filter((v) => v)
    const unique = [...new Set(title)]

    return await PreSelectModel.findOne(
        {
            user: userId,
            $text: { $search: unique.join(' ') },
        },
        { score: { $meta: 'textScore' } },
    )
        .sort({ score: { $meta: 'textScore' } })
        .populate({ path: 'category', model: CategoryModel })
        .then((response) => {
            if (!response) {
                throw new Error(ErrorMessages.FIND_CATEGORIES_FAILED)
            }
            return response
        })
        .catch(() => {
            throw new Error(ErrorMessages.FIND_CATEGORIES_FAILED)
        })
}
