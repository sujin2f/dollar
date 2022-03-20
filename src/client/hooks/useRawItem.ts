import { useQuery } from '@apollo/client'
import { RawItem } from 'src/types/model'
import {
    GetRawItemsParam,
    GET_RAW_ITEMS,
    GraphQuery,
} from 'src/constants/graph-query'
import { useGlobalOption } from './useGlobalOption'

export const useRawItem = (items: RawItem[]) => {
    const { setCallout } = useGlobalOption()
    const { data, error } = useQuery<GetRawItemsParam>(
        GraphQuery.GET_RAW_ITEMS,
        {
            variables: { items },
        },
    )
    const rawItems = data ? data[GET_RAW_ITEMS] : []

    if (error) {
        setCallout(error.message)
    }

    return { rawItems }
}
