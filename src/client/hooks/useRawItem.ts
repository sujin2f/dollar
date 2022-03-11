import { useQuery } from '@apollo/client'
import { RawItem } from 'src/types/model'
import { GraphQuery } from 'src/client/const/graph-query'
import { useGlobalOption } from './useGlobalOption'

type GetRawItemsQueryParam = {
    getRawItems: RawItem[]
}

export const useRawItem = (items: RawItem[]) => {
    const { setCallout } = useGlobalOption()
    const { data, error } = useQuery<GetRawItemsQueryParam>(
        GraphQuery.GET_RAW_ITEMS,
        {
            variables: { items },
        },
    )

    if (error) {
        setCallout(error.message)
    }

    return { rawItem: data ? data.getRawItems : [] }
}
