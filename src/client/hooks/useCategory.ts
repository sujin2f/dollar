import { useMutation, useQuery } from '@apollo/client'

import { Category } from 'src/types/model'
import { Nullable } from 'src/types/common'
import { CategoriesParam, Fields, GraphQuery } from 'src/constants/graph-query'
import { useGlobalOption } from './useGlobalOption'

export const useCategory = () => {
    const { openCallout } = useGlobalOption()
    const { data, error } = useQuery<CategoriesParam>(GraphQuery.GET_CATEGORIES)

    const getSubCategories = (_id: string): Category[] => {
        const mustData = data ? data[Fields.CATEGORIES] : []
        if (!mustData.length) {
            return []
        }

        return mustData.filter((category) => category.parent === _id)
    }

    const categories = data
        ? data[Fields.CATEGORIES].map((cat) => ({
              ...cat,
              children: getSubCategories(cat._id),
          }))
        : []

    if (error) {
        openCallout(error.message)
    }

    const [updateCategory] = useMutation(GraphQuery.UPDATE_CATEGORY, {
        variables: {
            category: {},
        },
        refetchQueries: [GraphQuery.GET_CATEGORIES],
        onError: (e) => {
            openCallout(e.message)
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

    const isCategoryHidden = (categoryId?: string): boolean => {
        if (!categories.length || !categoryId) {
            return false
        }

        const category = getCategoryById(categoryId)
        if (category && category.disabled) {
            return true
        }
        return false
    }

    return {
        categories,
        updateCategory,
        isCategoryHidden,
        getCategoryById,
        getCategoryByTitle,
        getRootCategories,
        getSubCategories,
    }
}
