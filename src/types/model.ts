export type Item = {
    _id: string
    date: string
    title: string
    debit: number
    credit: number
    category: Category
}

export type RawItem = {
    _id?: string
    checked?: boolean
    date: string
    title: string
    originTitle: string
    debit: number
    credit: number
    category?: string
    parentCategory?: string
}

export type Category = {
    _id: string
    title: string
    disabled: boolean
    color?: string
    parent?: Category
    children?: Category[]
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
