import mongoose, { Schema } from 'mongoose'
import { ErrorMessages } from 'src/constants'
import { Category } from 'src/types'

const categorySchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
})

export const CategoryModel = mongoose.model<Category>(
    'category',
    categorySchema,
)

export const getCategories = async (userId?: string): Promise<Category[]> => {
    if (!userId) {
        throw new Error(ErrorMessages.AUTHENTICATION_FAILED)
    }

    return await CategoryModel.find({ user: userId })
        .then((categories) => {
            if (!categories) {
                throw new Error(ErrorMessages.FIND_CATEGORIES_FAILED)
            }
            return categories
        })
        .catch(() => {
            throw new Error(ErrorMessages.FIND_CATEGORIES_FAILED)
        })
}

export const findOrCreateCategory = async (
    title: string,
    userId?: string,
): Promise<Category> => {
    if (!userId) {
        throw new Error(ErrorMessages.AUTHENTICATION_FAILED)
    }

    return await CategoryModel.findOneAndUpdate(
        {
            user: userId,
            title,
        },
        {},
        {
            returnOriginal: false,
            upsert: true,
        },
    )
}
