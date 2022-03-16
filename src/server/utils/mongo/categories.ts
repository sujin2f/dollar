import { Request } from 'express'
import mongoose, { Schema } from 'mongoose'
import { Palette } from 'src/constants/color'
import { ErrorMessages } from 'src/server/constants/messages'
import { Category } from 'src/types/model'
import { random } from 'src/utils/array'
import { getEnumValues } from 'src/utils/enum'

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
    color: String,
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
    { category: { _id, title, disabled, color } }: UpdateCategoryParam,
    { session: { user } }: Request,
): Promise<boolean> => {
    const result = await CategoryModel.updateOne(
        {
            _id,
            user,
        },
        {
            title,
            disabled,
            color,
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

const getCategory = async (user: string, title: string): Promise<Category> => {
    return await CategoryModel.findOne({
        user,
        title,
    })
        .then((result) => {
            if (!result) {
                throw new Error(ErrorMessages.FIND_CATEGORY_FAILED)
            }
            return result
        })
        .catch((e) => {
            throw new Error(ErrorMessages.FIND_CATEGORY_FAILED)
        })
}

const addCategory = async (user: string, title: string): Promise<Category> => {
    const color = random(getEnumValues(Palette))

    const category = new CategoryModel({
        user,
        title,
        color,
    })

    await category.save()

    return getCategory(user, title)
}

export const findOrCreateCategory = async (
    title: string,
    user: string,
): Promise<Category> => {
    return await getCategory(user, title).catch(() => {
        return addCategory(user, title)
    })
}
