import { useMutation, useQuery } from '@apollo/client'

import { Category } from 'src/types/model'
import { Nullable } from 'src/types/common'
import { GraphQuery } from 'src/client/const/graph-query'

type GetCategoriesQueryParam = {
    getCategories: Category[]
}

export const useCategory = () => {
    const { data, error } = useQuery<GetCategoriesQueryParam>(
        GraphQuery.GET_CATEGORIES,
    )

    if (error) {
        console.log(error.message)
    }

    const [updateCategory] = useMutation(GraphQuery.UPDATE_CATEGORY, {
        variables: {
            category: {},
        },
        refetchQueries: [GraphQuery.GET_CATEGORIES, 'getCategories'],
        onError: (e) => {
            console.log(e)
        },
    })

    const getCategoryById = (categoryId: string): Nullable<Category> => {
        if (!data || !data.getCategories) {
            return
        }

        for (const category of data.getCategories) {
            if (category._id === categoryId) {
                return category
            }
        }

        return
    }

    const isCategoryHidden = (categoryId: string): boolean => {
        const category = getCategoryById(categoryId)
        if (category && category.disabled) {
            return true
        }
        return false
    }

    return {
        categories: data ? data.getCategories : [],
        getCategoryById,
        isCategoryHidden,
        updateCategory,
    }
}
