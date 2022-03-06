export type Item = {
    _id: string
    date: string
    title: string
    debit: number
    credit: number
    categories: Category[]
}

export type Category = {
    _id: string
    title: string
}

export type PreSelect = {
    _id: string
    title: string
    categories: Category[]
}

export type User = {
    _id: string
    email: string
    name: string
    photo?: string
    darkMode?: boolean
}

export type CreateItemsParam = {
    checked: boolean
    date: string
    title: string
    originTitle: string
    categories: string[]
    debit: string
    credit: string
}
