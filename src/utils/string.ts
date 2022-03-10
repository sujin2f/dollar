import { TableHeader } from 'src/types/table'

export const getType = (str: string): TableHeader => {
    if (!isNaN(Date.parse(str))) {
        return TableHeader.Date
    }

    if (/^[A-Z]{2}$/.test(str)) {
        return TableHeader.Code
    }

    if (/^\$?(([1-9]\d{0,2}(,\d{3})*)|0)?\.\d{1,2}$/.test(str)) {
        return TableHeader.Debit
    }

    return TableHeader.Title
}

export const currencyToNumber = (currency?: string): number => {
    if (!currency) {
        return 0
    }
    const float = parseFloat(currency.replace(/[^0-9.-]+/g, ''))
    if (!float || isNaN(float)) {
        return 0
    }
    return float
}
