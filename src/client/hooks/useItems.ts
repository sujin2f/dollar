import { useMutation, useQuery } from '@apollo/client'

import { useHistory } from 'react-router-dom'
import { Item, RawItem } from 'src/types/model'
import { GraphQuery } from 'src/constants/graph-query'
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
    const { getCategoryById, isCategoryHidden } = useCategory()
    const { setCallout, closeModal } = useGlobalOption()
    const history = useHistory()

    const variables =
        type === TableType.Daily ? { year, month, type } : { year, type }

    const { loading, error, data } = useQuery<GetItemsReturn>(
        GraphQuery.GET_ITEMS,
        {
            variables,
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
        refetchQueries: [GraphQuery.GET_ITEMS, GraphQuery.GET_CATEGORIES],
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

    const itemsToTableData = () => {
        let totalDebit = 0
        let totalCredit = 0

        const rows: {
            date: string
            debit: number
            credit: number
        }[] = []

        items.forEach((item) => {
            if (isCategoryHidden(item.category?._id)) {
                return
            }
            totalDebit += item.debit
            totalCredit += item.credit

            if (type === TableType.Daily) {
                return
            }
            const monthString =
                type === TableType.Monthly
                    ? item.date.substring(5, 7)
                    : item.date.substring(0, 4)
            const existing = rows[parseInt(monthString, 10)] || {}
            rows[parseInt(monthString, 10)] = {
                date: item.date,
                debit: item.debit + (existing.debit || 0),
                credit: item.credit + (existing.credit || 0),
            }
        })

        return { items: rows, totalCredit, totalDebit }
    }

    const items =
        data?.getItems && type !== TableType.Daily
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
        itemsToTableData,
    }
}
