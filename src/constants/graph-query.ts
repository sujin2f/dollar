import { gql } from '@apollo/client'
import { buildSchema } from 'graphql'
import { Category, RawItem, User } from 'src/types/model'

export const UPDATE_CATEGORY = 'updateCategory'
export const GET_ITEMS = 'getItems'
export const ADD_ITEM = 'addItem'
export const ADD_ITEMS = 'addItems'
export const DELETE_ITEM = 'deleteItem'
export const UPDATE_ITEM = 'updateItem'

export enum Fields {
    USER = 'user',
    RAW_ITEMS = 'rawItems',
    CATEGORIES = 'categories',
}

export enum Types {
    USER = 'User',
    CATEGORY = 'Category',
    RAW_ITEM = 'RawItem',
    ITEM = 'Item',
}

export type UserParam = {
    [Fields.USER]: User
}

export type CategoriesParam = {
    [Fields.CATEGORIES]: Category[]
}

export type RawItemsParam = {
    [Fields.RAW_ITEMS]: RawItem[]
}

export const GraphQuery = {
    GET_USER: gql`
        query {
            ${Fields.USER} {
                name
                email
                photo
                darkMode
            }
        }
    `,
    SET_USER: gql`
        mutation ${Fields.USER}($${Fields.USER}: Input${Types.USER}!) {
            ${Fields.USER}(${Fields.USER}: $${Fields.USER})
        }
    `,
    GET_CATEGORIES: gql`
        query {
            ${Fields.CATEGORIES} {
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
        query ${Fields.RAW_ITEMS}($items: [Input${Types.RAW_ITEM}]) {
            ${Fields.RAW_ITEMS}(${Fields.RAW_ITEMS}: $items) {
                checked
                date
                title
                originTitle
                debit
                credit
                category {
                    _id
                    title
                }
                subCategory {
                    _id
                    title
                }
            }
        }
    `,
}

const categoryNodes = `
    _id: String
    title: String
    disabled: Boolean
    color: String
    parent: String
`

const userNodes = `
    _id: String
    email: String
    name: String
    photo: String
    darkMode: Boolean
`

const rawItemNodes = `
    _id: String
    checked: Boolean
    date: String
    title: String
    originTitle: String
    debit: Float
    credit: Float
    category: String
    subCategory: String
`

export const schema = buildSchema(`
    type Query {
        ${Fields.USER}: ${Types.USER}
        ${Fields.CATEGORIES}: [${Types.CATEGORY}]
        ${GET_ITEMS}(
            year: Int!,
            type: String!
            month: Int,
        ): [Item]
        ${Fields.RAW_ITEMS}(
            ${Fields.RAW_ITEMS}: [Input${Types.RAW_ITEM}]
        ): [${Types.RAW_ITEM}]
    }
    type Mutation {
        ${Fields.USER}(user: Input${Types.USER}!): Boolean
        ${UPDATE_CATEGORY}(category: Input${Types.CATEGORY}): Boolean
        ${ADD_ITEMS}(items: [Input${Types.RAW_ITEM}]): String
        ${ADD_ITEM}(item: Input${Types.RAW_ITEM}): String
        ${DELETE_ITEM}(_id: String!): Boolean
        ${UPDATE_ITEM}(item: Input${Types.RAW_ITEM}): Boolean
    }
    type ${Types.CATEGORY} {
        ${categoryNodes}
        children: [Category]
    }
    input Input${Types.CATEGORY} {
        ${categoryNodes}
    }
    type ${Types.USER} {
        ${userNodes}
    }
    input Input${Types.USER} {
        ${userNodes}
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
        ${rawItemNodes}
    }
    input Input${Types.RAW_ITEM} {
        ${rawItemNodes}
    }
`)
