type RawItemRequired = {
    date: string
    title: string
    debit: number
    credit: number
}

export type Item = RawItemRequired & {
    _id: string
    category: Category
}

export type RawItem = RawItemRequired & {
    _id?: string
    checked?: boolean
    originTitle: string
    category?: string
    subCategory?: string
}

export type Category = {
    _id: string
    title: string
    disabled?: boolean
    color?: string
    parent?: string
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

export const itemToRawItem = (item: Item) => {
    return {
        _id: item._id,
        date: item.date,
        title: item.title,
        debit: item.debit,
        credit: item.credit,
        category: item.category?.title || '',
    } as RawItem
}
