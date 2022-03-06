import { ErrorMessages } from 'src/constants'
import { CategoryModel } from 'src/constants/mongo'
import { Category } from 'src/types'

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

export const findOrCreateCategories = async (
    titles: string[],
    userId?: string,
): Promise<Category[]> => {
    if (!userId) {
        throw new Error(ErrorMessages.AUTHENTICATION_FAILED)
    }

    const categories: Category[] = []

    for (const title of titles) {
        await CategoryModel.findOne({
            user: userId,
            title,
        })
            .then(async (result) => {
                if (result) {
                    categories.push(result)
                    return result
                }

                const newCategory = new CategoryModel({
                    title,
                    userId,
                })

                await newCategory.save()
                categories.push({
                    _id: title,
                    title,
                })
            })
            .catch(() => undefined)
    }
    return categories
}
