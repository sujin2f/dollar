import mongoose, { Schema } from 'mongoose'
import { ErrorMessages } from 'src/server/constants/messages'
import { Category } from 'src/types/model'

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

export const getCategories = async (user: string): Promise<Category[]> => {
    return await CategoryModel.find({ user }).catch(() => {
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
