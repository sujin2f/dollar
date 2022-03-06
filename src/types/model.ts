export type Item = {
    _id: string
    date: string
    title: string
    debit: number
    credit: number
    category: Category
}

export type Category = {
    _id: string
    title: string
}

export type PreSelect = {
    _id: string
    title: string
    category: Category
}

export type User = {
    _id: string
    email: string
    name: string
    photo?: string
    darkMode?: boolean
}

export type CreateItemsParam = {
    _id?: string
    checked: boolean
    date: string
    title: string
    originTitle: string
    category: string
    debit: string
    credit: string
}
