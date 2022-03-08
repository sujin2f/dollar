import { Request } from 'express'
import mongoose, { Schema } from 'mongoose'
import { ErrorMessages } from 'src/server/constants/messages'
import { Category } from 'src/types/model'

declare module 'express-session' {
    interface Session {
        user?: string
    }
}

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
    disabled: Boolean,
})

export const CategoryModel = mongoose.model<Category>(
    'category',
    categorySchema,
)

type UpdateCategoryParam = {
    category: Category
}
export const updateCategory = async (
    param: UpdateCategoryParam,
    req: Request,
): Promise<boolean> => {
    const result = await CategoryModel.updateOne(
        {
            _id: param.category._id,
            user: req.session.user,
        },
        {
            title: param.category.title,
            disabled: param.category.disabled,
        },
    ).catch(() => {
        throw new Error(ErrorMessages.UPDATE_CATEGORY_FAILED)
    })
    if (result.modifiedCount) {
        return true
    }
    throw new Error(ErrorMessages.UPDATE_CATEGORY_FAILED)
}

export const getCategories = async (
    _: void,
    req: Request,
): Promise<Category[]> => {
    return await CategoryModel.find({ user: req.session.user }).catch(() => {
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
