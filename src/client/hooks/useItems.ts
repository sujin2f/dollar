import { useMutation, useQuery } from '@apollo/client'

import { useHistory } from 'react-router-dom'
import { Item, RawItem } from 'src/types/model'
import { GraphQuery } from 'src/client/const/graph-query'
import { useGlobalOption } from './useGlobalOption'
import { useCategory } from './useCategory'
import { TableType } from 'src/constants/accountBook'

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
    const { getCategoryById } = useCategory()
    const { setCallout, closeModal } = useGlobalOption()
    const history = useHistory()

    const { loading, error, data } = useQuery<GetItemsReturn>(
        GraphQuery.GET_ITEMS,
        {
            variables: { year, month, type },
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

    const items =
        data?.getItems && type === TableType.Monthly
            ? (data.getItems.map((item) => ({
                  ...item,
                  category: getCategoryById(item.title),
              })) as Item[])
            : data?.getItems || []

    return {
        loading,
        items,
        deleteItem,
        addItems,
        addItem,
        updateItem,
    }
}
