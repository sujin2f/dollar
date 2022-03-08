import { useMutation, useQuery } from '@apollo/client'

import { useHistory } from 'react-router-dom'
import { Item, RawItem } from 'src/types/model'
import { GraphQuery } from 'src/client/const/graph-query'

type GetItemsQueryParam = {
    getItems: Item[]
}

export const useItems = (year?: number, month?: number, type?: string) => {
    const history = useHistory()
    const { loading, error, data } = useQuery<GetItemsQueryParam>(
        GraphQuery.GET_ITEMS,
        {
            variables: { year, month },
        },
    )

    if (error) {
        console.log(error.message)
        history.push('/')
    }

    const [addItems] = useMutation(GraphQuery.ADD_ITEMS, {
        variables: {
            items: [] as RawItem[],
        },
        refetchQueries: [GraphQuery.GET_ITEMS, 'getItems'],
        onError: (e) => {
            console.log(e)
        },
    })

    const [removeItem] = useMutation(GraphQuery.REMOVE_ITEM, {
        variables: {
            _id: '',
        },
        refetchQueries: [GraphQuery.GET_ITEMS, 'getItems'],
        onError: (e) => {
            console.log(e)
        },
    })

    return {
        loading,
        items: data ? data.getItems : [],
        removeItem,
        addItems,
    }
}
