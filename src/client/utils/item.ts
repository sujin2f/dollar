import { RawItem } from 'src/types/model'
import { TableHeader } from 'src/types/table'
import { addZero, formatDate } from 'src/utils/datetime'
import { currencyToNumber } from 'src/utils/string'

export const getRawItemMeta = (rawText: string) => {
    const result = {
        separate: '\t',
        columns: {} as Record<string, [number, string]>,
        dateFormat: '',
    }

    if (!rawText) {
        return result
    }

    const firstLine = rawText.split('\n').shift()

    if (!firstLine) {
        return result
    }

    // Separator
    if (firstLine.includes(',') && !firstLine.includes('\t')) {
        result.separate = ','
    }

    // Date Format
    if (rawText.match(/\d{2}\/\d{2}\/\d{4}/)) {
        result.dateFormat = 'DD/MM/YYYY'
    }

    firstLine.split(result.separate).forEach((text, index) => {
        const trimmed = text.trim()
        if (Object.keys(TableHeader).includes(trimmed)) {
            const resultKey = TableHeader[trimmed as keyof typeof TableHeader]
            result.columns[resultKey] = [index, trimmed]
        } else {
            result.columns[trimmed] = [index, trimmed]
        }
    })

    return result
}

export type RawItemMeta = ReturnType<typeof getRawItemMeta>

export const rawTextToRawItem = (
    rawText: string,
    meta: RawItemMeta,
): RawItem[] => {
    const separated = rawText.split('\n').map((row) => row.split(meta.separate))
    separated.shift()
    return separated
        .filter(
            (row) =>
                row[meta.columns.date[0]] &&
                row[meta.columns.title[0]] &&
                (row[meta.columns.debit[0]] || row[meta.columns.credit[0]]),
        )
        .map((row) => {
            let date = row[meta.columns.date[0]]
            const title = row[meta.columns.title[0]]
            const debit = meta.columns.debit
                ? currencyToNumber(row[meta.columns.debit[0]])
                : 0
            const credit = meta.columns.credit
                ? currencyToNumber(row[meta.columns.credit[0]])
                : 0
            switch (meta.dateFormat) {
                case 'DD/MM/YYYY':
                    const d = date.split('/')
                    if (d.length !== 3) {
                        date = ''
                        break
                    }
                    date = `${d[2]}-${addZero(d[1])}-${addZero(d[0])}`
                    break
                default:
                    date = formatDate(date)
            }
            return {
                checked: true,
                date,
                title,
                originTitle: title,
                debit,
                credit,
            } as RawItem
        })
        .filter((row) => row.date)
}
