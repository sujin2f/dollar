import { Nullable } from 'src/types/common'
import { CreateItemsParam } from 'src/types/model'
import { Column } from 'src/types/table'
import { addZero, formatDate } from 'src/utils'

export const rawTextToCreateItemsParams = (
    rawText: string,
    dateFormat: string,
): CreateItemsParam[] => {
    const tabSeparated = rawText
        .split('[line-break]')
        .map((row) => row.split('\t'))
    const columns: Column[] = []
    const result = []

    // Set columns with the first row
    if (!tabSeparated[0][0]) {
        return []
    }

    tabSeparated[0].forEach((text) => {
        if (Object.keys(Column).includes(text)) {
            columns.push(Column[text as keyof typeof Column])
        } else {
            columns.push(Column.Unknown)
        }
    })

    // Put data into result
    for (const row of tabSeparated.splice(1)) {
        const rowData: Partial<Record<Column, string>> = {}
        row.forEach((column, key) => (rowData[columns[key]] = column))
        result.push(rowData)
    }

    return result
        .map((row) => {
            let date: Nullable<string> = null
            switch (dateFormat) {
                case 'DD/MM/YYYY':
                    const dateString = row[Column.Date]?.split('/') || []
                    if (dateString.length !== 3) {
                        break
                    }
                    date = `${dateString[2]}-${addZero(
                        dateString[1],
                    )}-${addZero(dateString[0])}`
                    break
                default:
                    date = formatDate(row[Column.Date] || '')
            }
            return {
                checked: true,
                date,
                title: row[Column.Title],
                originTitle: row[Column.Title],
                category: '',
                debit: row[Column.Debit],
                credit: row[Column.Credit],
            } as CreateItemsParam
        })
        .filter((row) => {
            const dateValid =
                !row.date || row.date.toString() !== 'Invalid Date'
            if (!dateValid) {
                return false
            }
            return row.debit || row.credit
        })
}
