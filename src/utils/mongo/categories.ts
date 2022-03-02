import mongoose, { Schema } from 'mongoose'
import { ErrorMessages } from 'src/constants'
import { Category } from 'src/types'
import { cache } from 'src/utils'

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
    const cacheKey = `getCategories-${userId}`
    const cached = cache.get<Category[]>(cacheKey)
    if (cached) {
        return cached
    }
    return await CategoryModel.find({ user: userId })
        .then((categories) => {
            if (!categories) {
                throw new Error(ErrorMessages.FIND_CATEGORIES_FAILED)
            }
            cache.set<Category[]>(cacheKey, categories)
            return categories
        })
        .catch(() => {
            throw new Error(ErrorMessages.FIND_CATEGORIES_FAILED)
        })
}

export const createOrGetCategory = async (
    title: string,
    userId?: string,
): Promise<Category> => {
    if (!userId) {
        throw new Error(ErrorMessages.AUTHENTICATION_FAILED)
    }
    const categories = await getCategories(userId)
    const filtered = categories.filter((item) => item.title === title)
    if (filtered.length) {
        return filtered[0]
    }

    const cacheKey = `getCategories-${userId}`
    cache.del(cacheKey)

    const category = {
        user: userId,
        title,
    }
    const categoryModel = new CategoryModel(category)

    return await categoryModel.save().catch(() => {
        throw new Error(ErrorMessages.CREATE_CATEGORY_FAILED)
    })
}
