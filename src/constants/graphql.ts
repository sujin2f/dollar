/**
 * Constants for GraphQL
 *
 * @module constants
 */

export const graphqlSchema = `
    scalar Date
    type Query {
        getUser: User
        getCategories: [Category]
        getItems: [Item]
        getPreItems(rawText: String!, dateFormat: String!): [CreateItemsParam]
    }
    type Mutation {
        createItems(json: String!): Boolean
        setDarkMode(darkMode: Boolean!): Boolean
    }
    type Category {
        _id: String
        title: String
    }
    type User {
        _id: String
        email: String
        name: String
        photo: String
        darkMode: Boolean
    }
    type Item {
        _id: String
        date: Date
        title: String
        debit: Float
        credit: Float
        category: Category
    }
    type CreateItemsParam {
        checked: Boolean
        date: Date
        title: String
        originTitle: String
        category: String
        debit: String
        credit: String
    }
`

export const userQuery = `
    query {
        getUser {
            name
            email
            photo
            darkMode
        }
    }
`

export const categoryQuery = `
    query {
        getCategories {
            _id
            title
        }
    }
`

export const itemsQuery = `
    query {
        getItems {
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
`
