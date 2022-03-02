import { useContext, useEffect } from 'react'
import { gql } from '@apollo/client'

import { graphqlClient } from 'src/utils'
import {
    ContextType,
    Context,
    getItemsInit,
    getItemsSuccess,
    getItemsFailed,
} from 'src/client/store'
import { ApiState, Item, WithApiState, CreateItemsParam } from 'src/types'
import { itemsQuery } from 'src/constants/graphql'

type GetItemsQueryParam = {
    getItems: Item[]
}

export const useItems = (): WithApiState<Item[]> => {
    const [{ items }, dispatch] = useContext(Context) as ContextType

    useEffect(() => {
        if (items !== ApiState.NotAssigned) {
            return
        }

        dispatch(getItemsInit())
        graphqlClient
            .query<GetItemsQueryParam>({
                query: gql`
                    ${itemsQuery}
                `,
            })
            .then((response) => {
                const responseItems = response.data.getItems.map((item) => ({
                    ...item,
                    date: new Date(item.date),
                }))
                dispatch(getItemsSuccess(responseItems))
            })
            .catch(() => {
                dispatch(getItemsFailed())
            })
    }, [dispatch, items])

    return items
}

export const createItems = (tableData: CreateItemsParam[]): void => {
    const items = tableData.filter((row) => row.checked)
    const json = JSON.stringify(items).replaceAll("'", '').replaceAll('"', "'")
    graphqlClient
        .mutate({
            mutation: gql`
                    mutation {
                        createItems(
                            json: "${json}"
                        )
                    }
                `,
        })
        .then(() => {
            window.location.href = '/app'
        })
        .catch((e) => {
            // Error Handling
            console.error(e)
        })
}
