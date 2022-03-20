import { useMutation, useQuery } from '@apollo/client'

import { useHistory } from 'react-router-dom'
import { Item, RawItem } from 'src/types/model'
import { GraphQuery, ItemParam, ItemsParam } from 'src/constants/graph-query'
import { useGlobalOption } from './useGlobalOption'
import { useCategory } from './useCategory'
import { TableType } from 'src/constants/accountBook'

export const useItems = (year?: number, month?: number, type?: string) => {
    const { getCategoryById, isCategoryHidden } = useCategory()
    const { setCallout, closeModal } = useGlobalOption()
    const history = useHistory()

    const variables =
        type === TableType.Daily ? { year, month, type } : { year, type }

    const { loading, error, data } = useQuery<ItemsParam>(
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

    const [addItems] = useMutation<ItemsParam>(GraphQuery.ADD_ITEMS, {
        variables: {
            rawItems: [] as RawItem[],
        },
        refetchQueries: [GraphQuery.GET_ITEMS, GraphQuery.GET_CATEGORIES],
        onError: (e) => {
            setCallout(e.message)
        },
        onCompleted: ({ items: redirection }) => {
            history.push(redirection as unknown as string)
        },
    })

    const [addItem] = useMutation<ItemParam>(GraphQuery.MUTATE_ITEM, {
        variables: {
            rawItem: {} as RawItem,
            type: 'add',
        },
        refetchQueries: [GraphQuery.GET_ITEMS],
        onError: (e) => {
            setCallout(e.message)
        },
        onCompleted: ({ rawItem: redirection }) => {
            history.push(redirection as unknown as string)
            closeModal()
        },
    })

    const [updateItem] = useMutation<ItemParam>(GraphQuery.MUTATE_ITEM, {
        variables: {
            rawItem: {} as RawItem,
            type: 'update',
        },
        refetchQueries: [GraphQuery.GET_ITEMS],
        onError: (e) => {
            setCallout(e.message)
        },
        onCompleted: () => {
            closeModal()
        },
    })

    const [deleteItem] = useMutation<ItemParam>(GraphQuery.MUTATE_ITEM, {
        variables: {
            rawItem: {} as RawItem,
            type: 'delete',
        },
        refetchQueries: [GraphQuery.GET_ITEMS],
        onError: (e) => {
            setCallout(e.message)
        },
    })

    const items: Item[] =
        data?.items && type !== TableType.Daily
            ? data.items.map(
                  (item) =>
                      ({
                          ...item,
                          category: getCategoryById(item.title),
                      } as Item),
              )
            : data?.items || []

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
