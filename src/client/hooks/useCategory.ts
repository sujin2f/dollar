import { useMutation, useQuery } from '@apollo/client'

import { Category } from 'src/types/model'
import { Nullable } from 'src/types/common'
import { GET_CATEGORIES, GraphQuery } from 'src/constants/graph-query'
import { useGlobalOption } from './useGlobalOption'

type GetCategoriesQueryParam = {
    [GET_CATEGORIES]: Category[]
}

export const useCategory = () => {
    const { setCallout } = useGlobalOption()
    const { data, error } = useQuery<GetCategoriesQueryParam>(
        GraphQuery.GET_CATEGORIES,
    )
    const categories = data ? data.getCategories : []

    if (error) {
        setCallout(error.message)
    }

    const [updateCategory] = useMutation(GraphQuery.UPDATE_CATEGORY, {
        variables: {
            category: {},
        },
        refetchQueries: [GraphQuery.GET_CATEGORIES],
        onError: (e) => {
            setCallout(e.message)
        },
    })

    const getCategoryById = (categoryId: string): Nullable<Category> => {
        if (!categories.length) {
            return
        }

        for (const category of categories) {
            if (category._id === categoryId) {
                return category
            }
        }

        return
    }

    const getCategoryByTitle = (title: string): Nullable<Category> => {
        if (!categories.length) {
            return
        }

        for (const category of categories) {
            if (category.title === title) {
                return category
            }
        }

        return
    }

    const getRootCategories = (): Category[] => {
        if (!categories.length) {
            return []
        }

        return categories.filter((category) => !category.parent)
    }

    const getSubCategories = (_id: string): Category[] => {
        if (!categories.length) {
            return []
        }

        return categories.filter((category) => category.parent === _id)
    }

    const isCategoryHidden = (categoryId: string): boolean => {
        const category = getCategoryById(categoryId)
        if (category && category.disabled) {
            return true
        }
        return false
    }

    return {
        categories,
        getCategoryById,
        isCategoryHidden,
        updateCategory,
        getCategoryByTitle,
        getRootCategories,
        getSubCategories,
    }
}
