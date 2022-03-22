import { useQuery } from '@apollo/client'
import { RawItem } from 'src/types/model'
import { RawItemsParam, Fields, GraphQuery } from 'src/constants/graph-query'
import { useGlobalOption } from './useGlobalOption'

export const useRawItem = (rawItems: RawItem[]) => {
    const { setCallout } = useGlobalOption()
    const { data, error } = useQuery<RawItemsParam>(GraphQuery.GET_RAW_ITEMS, {
        variables: { rawItems },
        skip: !rawItems || !rawItems.length,
    })
    const items = data ? data[Fields.RAW_ITEMS] : []

    if (error) {
        setCallout(error.message)
    }

    return { rawItems: items }
}
