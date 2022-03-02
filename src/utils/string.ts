import { Column } from 'src/types'

export const getType = (str: string): Column => {
    if (!isNaN(Date.parse(str))) {
        return Column.Date
    }

    if (/^[A-Z]{2}$/.test(str)) {
        return Column.Code
    }

    if (/^\$?(([1-9]\d{0,2}(,\d{3})*)|0)?\.\d{1,2}$/.test(str)) {
        return Column.Debit
    }

    return Column.Title
}

export const currencyToNumber = (currency: string): number => {
    return parseFloat(currency.replace(/[^0-9.-]+/g, ''))
}
