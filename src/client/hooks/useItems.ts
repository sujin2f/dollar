import { useMutation, useQuery } from '@apollo/client'

import { useHistory } from 'react-router-dom'
import { Item, RawItem } from 'src/types/model'
import { GraphQuery } from 'src/client/const/graph-query'
import { useGlobalOption } from './useGlobalOption'

type GetItemsReturn = {
    getItems: Item[]
}
type AddItemsReturn = {
    addItems: string
}
type AddItemReturn = {
    addItem: string
}
export const useItems = (year?: number, month?: number, type?: string) => {
    const { setCallout, closeModal } = useGlobalOption()
    const history = useHistory()

    const { loading, error, data } = useQuery<GetItemsReturn>(
        GraphQuery.GET_ITEMS,
        {
            variables: { year, month },
            skip: !year && !month && !type,
        },
    )

    if (error) {
        setCallout(error.message)
        history.push('/')
    }

    const [addItems] = useMutation<AddItemsReturn>(GraphQuery.ADD_ITEMS, {
        variables: {
            items: [] as RawItem[],
        },
        refetchQueries: [GraphQuery.GET_ITEMS],
        onError: (e) => {
            setCallout(e.message)
        },
        onCompleted: ({ addItems: redirection }) => {
            history.push(redirection)
        },
    })

    const [addItem] = useMutation<AddItemReturn>(GraphQuery.ADD_ITEM, {
        variables: {
            item: {} as RawItem,
        },
        refetchQueries: [GraphQuery.GET_ITEMS],
        onError: (e) => {
            setCallout(e.message)
        },
        onCompleted: ({ addItem: redirection }) => {
            history.push(redirection)
            closeModal()
        },
    })

    const [updateItem] = useMutation(GraphQuery.UPDATE_ITEM, {
        variables: {
            item: {} as RawItem,
        },
        refetchQueries: [GraphQuery.GET_ITEMS],
        onError: (e) => {
            setCallout(e.message)
        },
        onCompleted: () => {
            closeModal()
        },
    })

    const [deleteItem] = useMutation(GraphQuery.DELETE_ITEM, {
        variables: {
            _id: '',
        },
        refetchQueries: [GraphQuery.GET_ITEMS],
        onError: (e) => {
            setCallout(e.message)
        },
    })

    return {
        loading,
        items: data ? data.getItems : [],
        deleteItem,
        addItems,
        addItem,
        updateItem,
    }
}
