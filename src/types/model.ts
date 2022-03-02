export type Item = {
    _id: string
    date: Date
    title: string
    debit: number
    credit: number
    category?: Category
}

export type Category = {
    _id: string
    title: string
}

export type PreSelect = {
    _id: string
    title: string
    haystack: string
    category?: Category
}

export type User = {
    _id: string
    email: string
    name: string
    photo?: string
    darkMode?: boolean
}
