import { gql } from '@apollo/client'

export const GraphQuery = {
    GET_USER: gql`
        query {
            getUser {
                name
                email
                photo
                darkMode
            }
        }
    `,
    SET_DARK_MODE: gql`
        mutation setDarkMode($darkMode: Boolean!) {
            setDarkMode(darkMode: $darkMode)
        }
    `,
    GET_CATEGORIES: gql`
        query {
            getCategories {
                _id
                title
                disabled
            }
        }
    `,
    UPDATE_CATEGORY: gql`
        mutation UpdateCategory($category: CategoryUpdate) {
            updateCategory(category: $category)
        }
    `,
    GET_ITEMS: gql`
        query GetItems($year: Int, $month: Int) {
            getItems(year: $year, month: $month) {
                _id
                date
                title
                debit
                credit
                category {
                    _id
                    title
                }
            }
        }
    `,
    ADD_ITEM: gql`
        mutation AddItem($item: RawItemInput) {
            addItem(item: $item)
        }
    `,
    ADD_ITEMS: gql`
        mutation AddItems($items: [RawItemInput]) {
            addItems(items: $items)
        }
    `,
    REMOVE_ITEM: gql`
        mutation RemoveItem($_id: String) {
            removeItem(_id: $_id)
        }
    `,
    GET_RAW_ITEMS: gql`
        query GetRawItems($items: [RawItemInput]) {
            getRawItems(items: $items) {
                checked
                date
                title
                originTitle
                debit
                credit
                category
            }
        }
    `,
}
