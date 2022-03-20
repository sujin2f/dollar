import { Request } from 'express'
import mongoose, { Schema } from 'mongoose'
import { Palette } from 'src/constants/color'
import { CategoryParam } from 'src/constants/graph-query'
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
    subTitle?: string,
): Promise<Category> => {
    if (!subTitle) {
        return await mustGetCategory(user, title)
    }

    const child = await mayGetCategoryByString(user, subTitle).catch(
        () => undefined,
    )
    const parent = await mayGetCategoryByString(user, title).catch(
        () => undefined,
    )
    const children = parent?.children?.map((cat) => cat._id.toString()) || []
    const parentId = parent?._id.toString() || 'parentId'
    const childId = child?._id.toString() || 'childId'
    const childParentId =
        (child?.parent && child.parent.toString()) || 'childParentId'

    // Parent exist and child not, create and relation
    if (!child && parent) {
        const newChild = await mustGetCategory(user, subTitle)
        await addChild(user, parent, newChild)
        newChild.parent = parent._id
        return newChild
    }

    // 🤬 A parent already has a parent, throw
    if (parent && parent.parent) {
        throw new Error(
            '🤬 You tried to make category with a sub-category, but the category is already a sub-category of another category.',
        )
    }

    // 🤬 Child exist and parent not, throw
    if (child && !parent) {
        throw new Error(
            '🤬 You tried to make category with a sub-category. However, the sub-category does already exist, but a parent is not.',
        )
    }

    // 🤬 Both exist and relationship not, throw
    if (
        child &&
        parent &&
        (childParentId !== parentId || !children.includes(childId))
    ) {
        throw new Error(
            '🤬 You tried to make category with a sub-category. However, they are already has their own relationship.',
        )
    }

    // Child and parent exist and relationship, return
    if (
        child &&
        parent &&
        childParentId === parentId &&
        children.includes(childId)
    ) {
        return child
    }

    // Both do not exist
    const childCategory = await mustGetCategory(user, subTitle)
    return await mustGetCategory(user, title, childCategory)
}

const mustGetCategory = async (
    user: string,
    title: string,
    child?: Category,
): Promise<Category> => {
    const color = random(getEnumValues(Palette))
    const result = await CategoryModel.findOneAndUpdate(
        {
            user,
            title,
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
        .catch(
            /* istanbul ignore next */ () => {
                throw new Error(ErrorMessages.FIND_CATEGORIES_FAILED)
            },
        )

    if (!child) {
        return result
    }

    const newChild = await mustGetCategory(user, child.title)
    if (!result.children || !result.children.includes(result)) {
        await addChild(user, result, newChild)
        newChild.parent = result._id
    }
    return newChild
}

export const updateCategory = async (
    { category: { _id, title, disabled, color } }: CategoryParam,
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
    return await CategoryModel.find({ user }).catch(
        /* istanbul ignore next */ () => [],
    )
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
    ).catch(
        /* istanbul ignore next */ () => {
            throw new Error(ErrorMessages.UPDATE_CATEGORY_FAILED)
        },
    )

    await CategoryModel.updateOne(
        {
            _id: child._id,
            user,
        },
        {
            parent,
        },
    ).catch(
        /* istanbul ignore next */ () => {
            throw new Error(ErrorMessages.UPDATE_CATEGORY_FAILED)
        },
    )

    return true
}
