import { gql } from '@apollo/client'
import { buildSchema } from 'graphql'
import { Category, Item, RawItem, User } from 'src/types/model'
import { TableType } from './accountBook'

export enum Fields {
    USER = 'user',
    RAW_ITEMS = 'rawItems',
    RAW_ITEM = 'rawItem',
    CATEGORIES = 'categories',
    CATEGORY = 'category',
    ITEMS = 'items',
    ITEM = 'item',
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

export type CategoryParam = {
    [Fields.CATEGORY]: Category
}

export type ItemsParam = {
    [Fields.ITEMS]: Item[]
    [Fields.RAW_ITEMS]: RawItem[]
    year: number
    month: number
    type: TableType
}

export type ItemParam = {
    [Fields.RAW_ITEM]: RawItem
    type?: string
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
            }
        }
    `,
    UPDATE_CATEGORY: gql`
        mutation ${Fields.CATEGORY}($${Fields.CATEGORY}: Input${Types.CATEGORY}) {
            ${Fields.CATEGORY}(${Fields.CATEGORY}: $${Fields.CATEGORY})
        }
    `,
    GET_ITEMS: gql`
        query ${Fields.ITEMS}($year: Int!, $type: String!, $month: Int) {
            ${Fields.ITEMS}(year: $year, month: $month, type: $type) {
                _id
                date
                title
                debit
                credit
                category {
                    _id
                    title
                    color
                    parent
                    disabled
                }
            }
        }
    `,
    ADD_ITEMS: gql`
        mutation ${Fields.ITEMS}($${Fields.RAW_ITEMS}: [Input${Types.RAW_ITEM}]) {
            ${Fields.ITEMS}(${Fields.RAW_ITEMS}: $${Fields.RAW_ITEMS})
        }
    `,
    MUTATE_ITEM: gql`
        mutation ${Fields.ITEM}(
            $${Fields.RAW_ITEM}: Input${Types.RAW_ITEM}!,
            $type: String
        ) {
            ${Fields.ITEM}(
                ${Fields.RAW_ITEM}: $${Fields.RAW_ITEM},
                type: $type
            )
        }
    `,
    GET_RAW_ITEMS: gql`
        query ${Fields.RAW_ITEMS}($${Fields.RAW_ITEMS}: [Input${Types.RAW_ITEM}]) {
            ${Fields.RAW_ITEMS}(${Fields.RAW_ITEMS}: $${Fields.RAW_ITEMS}) {
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

const itemNode = `
    _id: String
    date: String
    title: String
    debit: Float
    credit: Float
    category: ${Types.CATEGORY}
`

export const schema = buildSchema(`
    type Query {
        ${Fields.USER}: ${Types.USER}
        ${Fields.CATEGORIES}: [${Types.CATEGORY}]
        ${Fields.ITEMS}(
            year: Int!,
            type: String!
            month: Int,
        ): [${Types.ITEM}]
        ${Fields.RAW_ITEMS}(
            ${Fields.RAW_ITEMS}: [Input${Types.RAW_ITEM}]
        ): [${Types.RAW_ITEM}]
    }
    type Mutation {
        ${Fields.USER}(user: Input${Types.USER}!): Boolean
        ${Fields.CATEGORY}(${Fields.CATEGORY}: Input${Types.CATEGORY}): Boolean
        ${Fields.ITEMS}(${Fields.RAW_ITEMS}: [Input${Types.RAW_ITEM}]): String
        ${Fields.ITEM}(
            ${Fields.RAW_ITEM}: Input${Types.RAW_ITEM},
            type: String
        ): String
    }
    type ${Types.CATEGORY} {
        ${categoryNodes}
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
        ${itemNode}
    }
    type ${Types.RAW_ITEM} {
        ${rawItemNodes}
    }
    input Input${Types.RAW_ITEM} {
        ${rawItemNodes}
    }
`)
