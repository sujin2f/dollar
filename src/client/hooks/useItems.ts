import { useContext, useEffect } from 'react'
import { gql } from '@apollo/client'

import { graphqlClient } from 'src/utils'
import {
    ContextType,
    Context,
    getItemsInit,
    getItemsSuccess,
    getItemsFailed,
    resetPreItems as resetStorePreItems,
    getItemsReset,
} from 'src/client/store'
import { useGlobalOption } from 'src/client/hooks'
import { useHistory } from 'react-router-dom'
import { CreateItemsParam, Item } from 'src/types/model'
import { ApiState, isApiState } from 'src/types/store'

type GetItemsQueryParam = {
    getItems: Item[]
}

export const useItems = (year?: number, month?: number, type?: string) => {
    const [
        {
            items,
            option: { apolloCache },
        },
        dispatch,
    ] = useContext(Context) as ContextType
    const history = useHistory()
    const { setDeleteItemModal, resetApolloCache } = useGlobalOption()

    useEffect(() => {
        if (year && month && type) {
            dispatch(getItemsReset())
        }
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
                        getItems(
                            year: ${year},
                            month: ${month},
                            version: ${apolloCache}
                        ) {
                            _id
                            date
                            title
                            debit
                            credit
                            category {
                                _id
                                title
                            }
                        }
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

    const deleteItem = (itemId: string) => {
        graphqlClient
            .mutate({
                mutation: gql`
                    mutation {
                        deleteItem(itemId: "${itemId}")
                    }
                `,
            })
            .then(() => {
                resetApolloCache()
                dispatch(getItemsReset())
                setDeleteItemModal()
            })
            .catch((e: Error) => {
                console.error(e.message)
                setDeleteItemModal()
            })
    }

    const createItems = (
        tableData: CreateItemsParam[],
        setPreSelect: boolean,
    ) => {
        const sorted = tableData.sort(
            (f, s) => new Date(s.date).getTime() - new Date(f.date).getTime(),
        )[0]
        const json = JSON.stringify(tableData.filter((row) => row.checked))
            .replaceAll("'", '')
            .replaceAll('"', "'")
        graphqlClient
            .mutate({
                mutation: gql`
                mutation {
                    createItems(
                        json: "${json}",
                        setPreSelect: ${setPreSelect ? 'true' : 'false'}
                    )
                }
            `,
            })
            .then(() => {
                dispatch(resetStorePreItems())
                resetApolloCache()
                const redirect = new Date(sorted.date)
                const pathYear = redirect.getUTCFullYear()
                const pathMonth = redirect.getUTCMonth() + 1
                history.push(`/app/daily/${pathYear}/${pathMonth}`)
            })
            .catch((e: Error) => {
                console.error(e.message)
            })
    }

    return {
        items: isApiState(items) ? [] : (items as Item[]),
        deleteItem,
        createItems,
    }
}
