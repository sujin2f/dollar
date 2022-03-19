import { gql } from '@apollo/client'
import { buildSchema } from 'graphql'

export const GET_USER = 'getUser'
export const SET_DARK_MODE = 'setDarkMode'
export const GET_CATEGORIES = 'getCategories'
export const UPDATE_CATEGORY = 'updateCategory'
export const GET_ITEMS = 'getItems'
export const ADD_ITEM = 'addItem'
export const ADD_ITEMS = 'addItems'
export const DELETE_ITEM = 'deleteItem'
export const UPDATE_ITEM = 'updateItem'
export const GET_RAW_ITEMS = 'GetRawItems'

export enum Types {
    CATEGORY = 'Category',
    RAW_ITEM = 'RawItem',
    ITEM = 'Item',
}

export const GraphQuery = {
    GET_USER: gql`
        query {
            ${GET_USER} {
                name
                email
                photo
                darkMode
            }
        }
    `,
    SET_DARK_MODE: gql`
        mutation ${SET_DARK_MODE}($darkMode: Boolean!) {
            ${SET_DARK_MODE}(darkMode: $darkMode)
        }
    `,
    GET_CATEGORIES: gql`
        query {
            ${GET_CATEGORIES} {
                _id
                title
                disabled
                color
                parent
                children {
                    _id
                    title
                    disabled
                    color
                }
            }
        }
    `,
    UPDATE_CATEGORY: gql`
        mutation ${UPDATE_CATEGORY}($category: Input${Types.CATEGORY}) {
            ${UPDATE_CATEGORY}(category: $category)
        }
    `,
    GET_ITEMS: gql`
        query ${GET_ITEMS}($year: Int!, $type: String!, $month: Int) {
            ${GET_ITEMS}(year: $year, month: $month, type: $type) {
                _id
                date
                title
                debit
                credit
                category {
                    _id
                    title
                    color
                }
            }
        }
    `,
    ADD_ITEM: gql`
        mutation ${ADD_ITEM}($item: Input${Types.RAW_ITEM}) {
            ${ADD_ITEM}(item: $item)
        }
    `,
    ADD_ITEMS: gql`
        mutation ${ADD_ITEMS}($items: [Input${Types.RAW_ITEM}]) {
            ${ADD_ITEMS}(items: $items)
        }
    `,
    DELETE_ITEM: gql`
        mutation ${DELETE_ITEM}($_id: String!) {
            ${DELETE_ITEM}(_id: $_id)
        }
    `,
    UPDATE_ITEM: gql`
        mutation ${UPDATE_ITEM}($item: Input${Types.RAW_ITEM}!) {
            ${UPDATE_ITEM}(item: $item)
        }
    `,
    GET_RAW_ITEMS: gql`
        query ${GET_RAW_ITEMS}($items: [Input${Types.RAW_ITEM}]) {
            ${GET_RAW_ITEMS}(items: $items) {
                checked
                date
                title
                originTitle
                debit
                credit
                category
                subCategory
            }
        }
    `,
}

export const schema = buildSchema(`
    type Query {
        ${GET_USER}: User
        ${GET_CATEGORIES}: [${Types.CATEGORY}]
        ${GET_ITEMS}(
            year: Int!,
            type: String!
            month: Int,
        ): [Item]
        ${GET_RAW_ITEMS}(items: [Input${Types.RAW_ITEM}]): [${Types.RAW_ITEM}]
    }
    type Mutation {
        ${SET_DARK_MODE}(darkMode: Boolean!): Boolean
        ${UPDATE_CATEGORY}(category: Input${Types.CATEGORY}): Boolean
        ${ADD_ITEMS}(items: [Input${Types.RAW_ITEM}]): String
        ${ADD_ITEM}(item: Input${Types.RAW_ITEM}): String
        ${DELETE_ITEM}(_id: String!): Boolean
        ${UPDATE_ITEM}(item: Input${Types.RAW_ITEM}): Boolean
    }
    type ${Types.CATEGORY} {
        _id: String
        title: String
        disabled: Boolean
        color: String
        children: [Category]
        parent: String
    }
    input Input${Types.CATEGORY} {
        _id: String
        title: String
        disabled: Boolean
        color: String
    }
    type User {
        _id: String
        email: String
        name: String
        photo: String
        darkMode: Boolean
    }
    type ${Types.ITEM} {
        _id: String
        date: String
        title: String
        debit: Float
        credit: Float
        category: Category
    }
    type ${Types.RAW_ITEM} {
        _id: String
        checked: Boolean
        date: String
        title: String
        originTitle: String
        debit: Float
        credit: Float
        category: Category
    }
    input Input${Types.RAW_ITEM} {
        _id: String
        checked: Boolean
        date: String
        title: String
        originTitle: String
        debit: Float
        credit: Float
        category: String
        subCategory: String
    }
`)
