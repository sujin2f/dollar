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

type GetCategoriesQueryParam = {
    getCategories: Category[]
}

export const useCategory = (): WithApiState<Category[]> => {
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

    return categories
}
