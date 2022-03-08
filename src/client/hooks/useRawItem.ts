import { useQuery } from '@apollo/client'
import { RawItem } from 'src/types/model'
import { GraphQuery } from 'src/client/const/graph-query'

type GetRawItemsQueryParam = {
    getRawItems: RawItem[]
}

export const useRawItem = (items: RawItem[]) => {
    const { data } = useQuery<GetRawItemsQueryParam>(GraphQuery.GET_RAW_ITEMS, {
        variables: { items },
    })

    return { rawItem: data ? data.getRawItems : [] }
}
