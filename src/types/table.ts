export enum Column {
    Unknown,
    Date = 'date',
    'Transaction Date' = 'date',
    Title = 'title',
    Description = 'title',
    Debit = 'debit',
    Amount = 'debit',
    Credit = 'credit',
    Code = 'code',
    Balance = 'balance',
    Category = 'category',
}

export type CreateItemsParam = {
    checked: boolean
    date: Date
    title: string
    originTitle: string
    category: string
    debit: string
    credit: string
}
