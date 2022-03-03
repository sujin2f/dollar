import { useContext, useEffect } from 'react'
import { gql } from '@apollo/client'

import { graphqlClient } from 'src/utils'
import {
    ContextType,
    Context,
    getItemsInit,
    getItemsSuccess,
    getItemsFailed,
    getPreItemsInit,
    getPreItemsSuccess,
    getPreItemsFailed,
    resetPreItems as resetStorePreItems,
} from 'src/client/store'
import {
    ApiState,
    Item,
    WithApiState,
    CreateItemsParam,
    Fn,
    StatePreItems,
} from 'src/types'
import { itemsQuery } from 'src/constants/graphql'

type GetItemsQueryParam = {
    getItems: Item[]
}

type GetPreItemsQueryParam = {
    getPreItems: CreateItemsParam[]
}

type SetPreItems = Fn<[string, string], void>
type ResetPreItems = Fn<[void], void>

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

export const useGetPreItems = (): [
    StatePreItems,
    SetPreItems,
    ResetPreItems,
] => {
    const [
        {
            option: { preItems },
        },
        dispatch,
    ] = useContext(Context) as ContextType

    const setPreItems = (dateFormat: string, rawText: string) => {
        dispatch(getPreItemsInit(dateFormat, rawText))

        graphqlClient
            .query<GetPreItemsQueryParam>({
                query: gql`
                    query {
                        getPreItems(
                            rawText: "${rawText.replaceAll(
                                '\n',
                                '[line-break]',
                            )}",
                            dateFormat: "${dateFormat}"
                        ) {
                            checked
                            date
                            title
                            originTitle
                            category
                            debit
                            credit
                        }
                    }`,
            })
            .then((response) => {
                dispatch(getPreItemsSuccess(response.data.getPreItems))
            })
            .catch((e) => {
                // Error Handling
                dispatch(getPreItemsFailed())
                console.error(e)
            })
    }

    const resetPreItems = () => {
        dispatch(resetStorePreItems())
    }

    return [preItems, setPreItems, resetPreItems]
}
