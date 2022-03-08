import { useContext } from 'react'
import { gql } from '@apollo/client'

import { graphqlClient } from 'src/utils'
import {
    ContextType,
    Context,
    getPreItemsInit,
    getPreItemsSuccess,
    getPreItemsFailed,
    resetPreItems as resetStorePreItems,
} from 'src/client/store'
import { CreateItemsParam } from 'src/types/model'

type GetPreItemsQueryParam = {
    getPreItems: CreateItemsParam[]
}

export const usePreItem = () => {
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
            .catch((e: Error) => {
                console.error(e.message)
                dispatch(getPreItemsFailed())
            })
    }

    const resetPreItems = () => {
        dispatch(resetStorePreItems())
    }

    return {
        preItems,
        setPreItems,
        resetPreItems,
    }
}
