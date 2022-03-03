import mongoose, { Schema } from 'mongoose'
import { ErrorMessages } from 'src/constants'
import { PreSelect } from 'src/types'
import { CategoryModel } from '.'

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

const PreSelectModel = mongoose.model<PreSelect>('preSelect', preSelectSchema)

export const findOrCreatePreSelect = async (
    keyword: string,
    categoryId: string,
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
    const unique = [...new Set(title)].sort()

    return await PreSelectModel.findOneAndUpdate(
        {
            user: userId,
            title: {
                $regex: `^${unique.join('.*')}`,
                $options: 'i',
            },
        },
        { $setOnInsert: { category: categoryId, title: unique.join(' ') } },
        {
            returnOriginal: false,
            upsert: true,
        },
    ).populate({ path: 'category', model: CategoryModel })
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
    const unique = [...new Set(title)].sort().join('.*')

    return await PreSelectModel.findOne({
        user: userId,
        title: {
            $regex: `^${unique}`,
            $options: 'i',
        },
    })
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
