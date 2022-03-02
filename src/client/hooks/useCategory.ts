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
import { ApiState, WithApiState, Category } from 'src/types'
import { categoryQuery } from 'src/constants'

type GetCategoriesQueryParam = {
    getCategories: Category[]
}

export const useCategory = (): WithApiState<Category[]> => {
    const [{ categories }, dispatch] = useContext(Context) as ContextType

    useEffect(() => {
        if (categories !== ApiState.NotAssigned) {
            return
        }

        dispatch(getCategoriesInit())
        graphqlClient
            .query<GetCategoriesQueryParam>({
                query: gql`
                    ${categoryQuery}
                `,
            })
            .then((response) => {
                dispatch(getCategoriesSuccess(response.data.getCategories))
            })
            .catch(() => {
                dispatch(getCategoriesFailed())
            })
    }, [dispatch, categories])

    return categories
}
