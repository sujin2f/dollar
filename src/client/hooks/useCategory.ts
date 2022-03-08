import { useContext, useEffect } from 'react'
import { gql } from '@apollo/client'

import {
    ContextType,
    Context,
    getCategoriesInit,
    getCategoriesSuccess,
    getCategoriesFailed,
} from 'src/client/store'
import { graphqlClient } from 'src/utils'
import { Category } from 'src/types/model'
import { ApiState, isApiState } from 'src/types/store'
import { Nullable } from 'src/types/common'

type GetCategoriesQueryParam = {
    getCategories: Category[]
}

export const useCategory = () => {
    const [
        {
            categories,
            option: { apolloCache },
        },
        dispatch,
    ] = useContext(Context) as ContextType

    useEffect(() => {
        if (categories !== ApiState.NotAssigned) {
            return
        }

        dispatch(getCategoriesInit())
        graphqlClient
            .query<GetCategoriesQueryParam>({
                query: gql`
                    query {
                        getCategories(version: ${apolloCache}) {
                            _id
                            title
                        }
                    }
                `,
            })
            .then((response) => {
                dispatch(getCategoriesSuccess(response.data.getCategories))
            })
            .catch((e: Error) => {
                console.error(e.message)
                dispatch(getCategoriesFailed())
            })
    }, [dispatch, categories, apolloCache])

    const toggleCategoryHidden = (categoryId: string): void => {
        if (isApiState(categories)) {
            return
        }

        const newCategories = (categories as Category[]).map((category) => {
            if (category._id === categoryId) {
                return {
                    ...category,
                    hide: !category.hide,
                }
            }
            return category
        })
        dispatch(getCategoriesSuccess(newCategories))
    }

    const getCategoryById = (categoryId: string): Nullable<Category> => {
        if (isApiState(categories)) {
            return
        }
        const newCategories = (categories as Category[]).filter(
            (category) => category._id === categoryId,
        )

        if (newCategories[0]) {
            return newCategories[0]
        }
        return
    }

    const isCategoryHidden = (categoryId: string): boolean => {
        const result = getCategoryById(categoryId)
        if (result && result.hide) {
            return true
        }
        return false
    }

    return {
        categories: isApiState(categories) ? [] : (categories as Category[]),
        toggleCategoryHidden,
        getCategoryById,
        isCategoryHidden,
    }
}
