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
        query GetItems($year: Int!, $month: Int!, $type: String!) {
            getItems(year: $year, month: $month, type: $type) {
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
    DELETE_ITEM: gql`
        mutation DeleteItem($_id: String!) {
            deleteItem(_id: $_id)
        }
    `,
    UPDATE_ITEM: gql`
        mutation UpdateItem($item: RawItemInput!) {
            updateItem(item: $item)
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
