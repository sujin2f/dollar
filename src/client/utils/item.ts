import { Nullable } from 'src/types/common'
import { RawItem } from 'src/types/model'
import { TableHeader } from 'src/types/table'
import { addZero, formatDate } from 'src/utils/datetime'
import { currencyToNumber } from 'src/utils/string'

export const rawTextToRawItem = (
    rawText: string,
    dateFormat: string,
): RawItem[] => {
    const tabSeparated = rawText.split('\n').map((row) => row.split('\t'))
    const columns: TableHeader[] = []
    const result = []

    // Set columns with the first row
    if (!tabSeparated[0][0]) {
        return []
    }

    tabSeparated[0].forEach((text) => {
        if (Object.keys(TableHeader).includes(text)) {
            columns.push(TableHeader[text as keyof typeof TableHeader])
        } else {
            columns.push(TableHeader.Unknown)
        }
    })

    // Put data into result
    for (const row of tabSeparated.splice(1)) {
        const rowData: Partial<Record<TableHeader, string>> = {}
        row.forEach((column, key) => (rowData[columns[key]] = column))
        result.push(rowData)
    }

    return result
        .map((row) => {
            let date: Nullable<string> = null
            switch (dateFormat) {
                case 'DD/MM/YYYY':
                    const dateString = row[TableHeader.Date]?.split('/') || []
                    if (dateString.length !== 3) {
                        break
                    }
                    date = `${dateString[2]}-${addZero(
                        dateString[1],
                    )}-${addZero(dateString[0])}`
                    break
                default:
                    date = formatDate(row[TableHeader.Date] || '')
            }
            return {
                checked: true,
                date,
                title: row[TableHeader.Title],
                originTitle: row[TableHeader.Title],
                category: '',
                debit: currencyToNumber(row[TableHeader.Debit]),
                credit: currencyToNumber(row[TableHeader.Credit]),
            } as RawItem
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
