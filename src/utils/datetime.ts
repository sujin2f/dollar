/**
 * Adding zero to a single string
 * 1 => 01
 * @param {string} number
 * @param {number} digits How many digits it should be
 * @return {string}
 */
export const addZero = (number: string | number, digits = 2): string => {
    const num = typeof number === 'string' ? number : number.toString()

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
    if (splitted.length !== 3) {
        const date = new Date()
        date.setHours(0)
        date.setMinutes(0)
        date.setSeconds(0)
        date.setMilliseconds(0)
        return date
    }
    const date = new Date()
    date.setFullYear(parseInt(splitted[0]))
    date.setMonth(parseInt(splitted[1]) - 1)
    date.setDate(parseInt(splitted[2]))

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
