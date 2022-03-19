import { Request } from 'express'
import mongoose, { Schema } from 'mongoose'
import { Palette } from 'src/constants/color'
import { ErrorMessages } from 'src/server/constants/messages'
import { Category } from 'src/types/model'
import { random } from 'src/utils/array'
import { getEnumValues } from 'src/utils/enum'

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
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'category',
    },
    children: [
        {
            type: Schema.Types.ObjectId,
            ref: 'category',
        },
    ],
    color: String,
    disabled: Boolean,
})

export const CategoryModel = mongoose.model<Category>(
    'category',
    categorySchema,
)

/**
 * Get or create a category by text
 *
 * @param {string} user User ID
 * @param {string} title Title of the category
 * @param {string} parentTitle (optional) Title of the parent category
 * @returns {Promise<Category>} Category get or created
 */
export const mustGetCategoryByString = async (
    user: string,
    title: string,
    parentTitle?: string,
): Promise<Category> => {
    if (!parentTitle) {
        return await mustGetCategory(user, title)
    }

    const parent = await mayGetCategoryByString(user, parentTitle).catch(
        () => undefined,
    )
    const child = await mayGetCategoryByString(user, title).catch(
        () => undefined,
    )
    const children = parent?.children?.map((cat) => cat._id.toString()) || []
    const parentId = parent?._id.toString() || 'parentId'
    const childParentId = child?.parent?._id.toString() || 'childParentId'

    // Parent has a parent, throw
    if (parent && parent.parent) {
        throw new Error(ErrorMessages.FIND_CATEGORY_FAILED)
    }

    // Child exist and parent not, throw
    if (child && !parent) {
        throw new Error(ErrorMessages.FIND_CATEGORY_FAILED)
    }

    // Child exist and relationship not, throw
    if (
        child &&
        (childParentId !== parentId || !children.includes(child._id.toString()))
    ) {
        throw new Error(ErrorMessages.FIND_CATEGORY_FAILED)
    }

    // Child and parent exist and relationship, return
    if (
        child &&
        parent &&
        childParentId === parentId &&
        children.includes(child._id.toString())
    ) {
        return child
    }

    // Parent exist and child not, create and relation
    if (!child && parent) {
        return await mustGetCategory(user, title, parent)
    }

    // Both do not exist
    const parentCategory = await mustGetCategory(user, parentTitle)
    return await mustGetCategory(user, title, parentCategory)
}

const mustGetCategory = async (
    user: string,
    title: string,
    parent?: Category,
): Promise<Category> => {
    const color = random(getEnumValues(Palette))
    const result = await CategoryModel.findOneAndUpdate(
        {
            user,
            title,
            parent,
        },
        {
            $setOnInsert: { color },
        },
        {
            returnOriginal: false,
            upsert: true,
        },
    )
        .populate({ path: 'children', model: CategoryModel })
        .catch(() => {
            throw new Error(ErrorMessages.FIND_CATEGORIES_FAILED)
        })

    if (parent) {
        const newParent = await mustGetCategory(user, parent.title)
        if (
            !newParent.children ||
            newParent.children.length === 0 ||
            !newParent.children.includes(result)
        ) {
            await addChild(user, newParent, result)
        }
    }

    return result
}

type UpdateCategoryParam = {
    category: Category
}
export const updateCategory = async (
    { category: { _id, title, disabled, color } }: UpdateCategoryParam,
    { session: { user } }: Request,
): Promise<boolean> => {
    await CategoryModel.updateOne(
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
    return true
}

export const getCategories = async (
    _: void,
    { session: { user } }: Request,
): Promise<Category[]> => {
    return await CategoryModel.find({ user, parent: null })
        .populate({ path: 'children', model: CategoryModel })
        .catch(() => {
            throw new Error(ErrorMessages.FIND_CATEGORIES_FAILED)
        })
}

const mayGetCategoryByString = async (
    user: string,
    title: string,
): Promise<Category> => {
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

const addChild = async (
    user: string,
    parent: Category,
    child: Category,
): Promise<boolean> => {
    await CategoryModel.updateOne(
        {
            _id: parent._id,
            user,
        },
        {
            $push: { children: child },
        },
    ).catch(() => {
        throw new Error(ErrorMessages.UPDATE_CATEGORY_FAILED)
    })
    return true
}
