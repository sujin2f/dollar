import express, { Request, Response, NextFunction } from 'express'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'graphql'
import { ErrorMessages } from 'src/server/constants/messages'

import {
    getUser,
    getCategories,
    updateCategory,
    getItems,
    getRawItems,
    addItems,
    addItem,
    setDarkMode,
    deleteItem,
    updateItem,
} from 'src/server/utils/mongo'

declare module 'express-session' {
    interface Session {
        user?: string
    }
}

const apiRouter = express.Router()
const schema = buildSchema(`
    type Query {
        getUser: User
        getCategories: [Category]
        getItems(
            year: Int!,
            type: String!
            month: Int,
        ): [Item]
        getRawItems(items: [RawItemInput]): [RawItem]
    }
    type Mutation {
        setDarkMode(darkMode: Boolean!): Boolean
        updateCategory(category: CategoryUpdate): Boolean
        addItems(items: [RawItemInput]): String
        addItem(item: RawItemInput): String
        deleteItem(_id: String!): Boolean
        updateItem(item: RawItemInput): Boolean
    }
    type Category {
        _id: String
        title: String
        disabled: Boolean
    }
    input CategoryUpdate {
        _id: String
        title: String
        disabled: Boolean
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
        category: Category
    }
    type RawItem {
        _id: String
        checked: Boolean
        date: String
        title: String
        originTitle: String
        debit: Float
        credit: Float
        category: String
    }
    input RawItemInput {
        _id: String
        checked: Boolean
        date: String
        title: String
        originTitle: String
        debit: Float
        credit: Float
        category: String
    }
`)

const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (req.session.user) {
        next()
        return
    }

    res.send({
        errors: [{ message: ErrorMessages.AUTHENTICATION_FAILED }],
    })
}
apiRouter.use(loggingMiddleware)

apiRouter.use(
    '/',
    graphqlHTTP({
        schema,
        rootValue: {
            getUser,
            setDarkMode,
            getCategories,
            updateCategory,
            getItems,
            getRawItems,
            addItems,
            addItem,
            deleteItem,
            updateItem,
        },
        graphiql: true,
    }),
)

export { apiRouter }
