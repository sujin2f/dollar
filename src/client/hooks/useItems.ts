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
    getItemsReset,
} from 'src/client/store'
import {
    Item,
    WithApiState,
    CreateItemsParam,
    Fn,
    StatePreItems,
    ApiState,
} from 'src/types'
import { itemsQuery } from 'src/constants/graphql'
import { useCloseModal, useResetApolloCache } from 'src/client/hooks'

type GetItemsQueryParam = {
    getItems: Item[]
}

type GetPreItemsQueryParam = {
    getPreItems: CreateItemsParam[]
}

type SetPreItems = Fn<[string, string], void>
type ResetPreItems = Fn<[void], void>

export const useItems = (
    year: number,
    month: number,
    type: string,
): WithApiState<Item[]> => {
    const [
        {
            items,
            option: { apolloCache },
        },
        dispatch,
    ] = useContext(Context) as ContextType

    useEffect(() => {
        dispatch(getItemsReset())
    }, [dispatch, year, month, type])

    useEffect(() => {
        if (items !== ApiState.NotAssigned) {
            return
        }

        dispatch(getItemsInit())
        graphqlClient
            .query<GetItemsQueryParam>({
                query: gql`
                    query {
                        getItems(year: ${year}, month: ${month}, version: ${apolloCache})
                        ${itemsQuery}
                    }
                `,
            })
            .then((response) => {
                dispatch(getItemsSuccess(response.data.getItems))
            })
            .catch((e: Error) => {
                console.error(e.message)
                dispatch(getItemsFailed())
            })
    }, [dispatch, items, year, month, type, apolloCache])

    return items
}

export const useDeleteItem = (): Fn<[void], void> => {
    const [
        {
            option: { deleteItemModal },
        },
        dispatch,
    ] = useContext(Context) as ContextType
    const closeModal = useCloseModal()
    const resetApolloCache = useResetApolloCache()
    const deleteItem = () => {
        graphqlClient
            .mutate({
                mutation: gql`
                    mutation {
                        deleteItem(itemId: "${deleteItemModal}")
                    }
                `,
            })
            .then(() => {
                resetApolloCache()
                dispatch(getItemsReset())
                closeModal()
            })
            .catch((e: Error) => {
                console.error(e.message)
                closeModal()
            })
    }

    return deleteItem
}

export const createItems = (tableData: CreateItemsParam[]): void => {
    const items = tableData.filter((row) => row.checked)
    const json = JSON.stringify(items).replaceAll("'", '').replaceAll('"', "'")
    graphqlClient
        .mutate({
            mutation: gql`
                mutation {
                    createItems(json: "${json}")
                }
            `,
        })
        .then(() => {
            window.location.href = '/app'
        })
        .catch((e: Error) => {
            console.error(e.message)
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
                            categories
                            debit
                            credit
                        }
                    }`,
            })
            .then((response) => {
                dispatch(getPreItemsSuccess(response.data.getPreItems))
            })
            .catch((e: Error) => {
                console.error(e.message)
                dispatch(getPreItemsFailed())
            })
    }

    const resetPreItems = () => {
        dispatch(resetStorePreItems())
    }

    return [preItems, setPreItems, resetPreItems]
}
