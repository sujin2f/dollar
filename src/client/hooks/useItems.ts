import { useMutation, useQuery } from '@apollo/client'

import { useHistory } from 'react-router-dom'
import { Item, RawItem } from 'src/types/model'
import { GraphQuery, ItemParam, ItemsParam } from 'src/constants/graph-query'
import { useGlobalOption } from './useGlobalOption'
import { useCategory } from './useCategory'
import { TableType } from 'src/constants/accountBook'

export const useItems = (year?: number, month?: number, type?: string) => {
    const { getCategoryById, isCategoryHidden } = useCategory()
    const { openCallout, closeComponents } = useGlobalOption()
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
        openCallout(error.message)
        history.push('/')
    }

    const [addItems] = useMutation<ItemsParam>(GraphQuery.ADD_ITEMS, {
        variables: {
            rawItems: [] as RawItem[],
        },
        refetchQueries: [GraphQuery.GET_ITEMS, GraphQuery.GET_CATEGORIES],
        onError: (e) => {
            openCallout(e.message)
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
            openCallout(e.message)
        },
        onCompleted: ({ rawItem: redirection }) => {
            history.push(redirection as unknown as string)
            closeComponents()
        },
    })

    const [updateItem] = useMutation<ItemParam>(GraphQuery.MUTATE_ITEM, {
        variables: {
            rawItem: {} as RawItem,
            type: 'update',
        },
        refetchQueries: [GraphQuery.GET_ITEMS],
        onError: (e) => {
            openCallout(e.message)
        },
        onCompleted: () => {
            closeComponents()
        },
    })

    const [deleteItem] = useMutation<ItemParam>(GraphQuery.MUTATE_ITEM, {
        variables: {
            rawItem: {} as RawItem,
            type: 'delete',
        },
        refetchQueries: [GraphQuery.GET_ITEMS],
        onError: (e) => {
            openCallout(e.message)
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

    const getItemsByCategoryId = (categoryId?: string) => {
        if (!categoryId) {
            return items.filter((item) => !item.category)
        }
        return items.filter((item) => item.category._id === categoryId)
    }

    return {
        loading,
        items,
        deleteItem,
        addItems,
        addItem,
        updateItem,
        itemsToTableData,
        getItemsByCategoryId,
    }
}
