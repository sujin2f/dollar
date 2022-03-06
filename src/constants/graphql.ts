/**
 * Constants for GraphQL
 *
 * @module constants
 */

export const graphqlSchema = `
    type Query {
        getUser: User
        getCategories(version: Float): [Category]
        getItems(year: Int, month: Int, version: Float): [Item]
        getPreItems(rawText: String!, dateFormat: String!): [CreateItemsParam]
    }
    type Mutation {
        createItems(json: String!): Boolean
        setDarkMode(darkMode: Boolean!): Boolean
        deleteItem(itemId: String!): Boolean
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
        date: String
        title: String
        debit: Float
        credit: Float
        categories: [Category]
    }
    type CreateItemsParam {
        checked: Boolean
        date: String
        title: String
        originTitle: String
        categories: [String]
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

export const itemsQuery = `
    {
        _id
        date
        title
        debit
        credit
        categories {
            _id
            title
        }
    }
`
