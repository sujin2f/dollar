export const formatDate = (dateString: string): string => {
    if (!dateString) {
        return ''
    }

    const date = new Date(dateString)
    if (date.toString() === 'Invalid Date') {
        return 'Invalid Date'
    }

    return `${date.getUTCFullYear()}-${addZero(
        date.getUTCMonth() + 1,
    )}-${addZero(date.getUTCDate())}`
}

/**
 * Adding zero to a single string
 * 1 => 01
 * @param {string} amount
 * @param {number} digits How many digits it should be
 * @return {string}
 */
export const addZero = (amount: string | number, digits = 2): string => {
    const num = typeof amount === 'string' ? amount : amount.toString()

    if (num.length >= digits) {
        return num
    }

    const value = new Array(digits - num.length).fill('0')
    value.push(num)

    return value.join('')
}

/**
 * Convert YYYY-DD-MM to Date
 * @param {string} yyyyMmDd YYYY-DD-MM
 * @return {Date}
 */
export const yyyyMmDdToDate = (yyyyMmDd: string): Date => {
    const splitted = yyyyMmDd.split('-')
    const date = new Date()
    if (splitted.length !== 3) {
        date.setHours(0)
        date.setMinutes(0)
        date.setSeconds(0)
        date.setMilliseconds(0)
        return date
    }

    date.setFullYear(parseInt(splitted[0], 10))
    date.setMonth(parseInt(splitted[1], 10) - 1)
    date.setDate(parseInt(splitted[2], 10))

    date.setHours(0)
    date.setMinutes(0)
    date.setSeconds(0)
    date.setMilliseconds(0)

    return date
}

export const getNextMidnight = (): number => {
    const now = new Date()
    const midnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0,
        0,
        0,
    )
    return midnight.getTime()
}
