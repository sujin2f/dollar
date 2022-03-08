import express, { Request, Response, NextFunction } from 'express'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'graphql'
import { ErrorMessages } from 'src/server/constants/messages'

import {
    getItems,
    createItems,
    getCategories,
    getUserById,
    setDarkMode,
    getPreItems,
    deleteItem,
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
        getCategories(version: Float): [Category]
        getItems(
            year: Int,
            month: Int,
            version: Float
        ): [Item]
        getPreItems(
            rawText: String!,
            dateFormat: String!
        ): [CreateItemsParam]
    }
    type Mutation {
        createItems(
            json: String!,
            setPreSelect: Boolean!
        ): Boolean
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
        category: Category
    }
    type CreateItemsParam {
        checked: Boolean
        date: String
        title: String
        originTitle: String
        category: String
        debit: String
        credit: String
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

type CreateItemsParam = {
    json: string
    setPreSelect: boolean
}

type SetDarkModeParam = {
    darkMode: boolean
}

type PreItemsParam = {
    rawText: string
    dateFormat: string
}

type GetItemsParam = {
    year: number
    month: number
}

type DeleteItemParam = {
    itemId: string
}

apiRouter.use(
    '/',
    graphqlHTTP({
        schema,
        rootValue: {
            getCategories: async (_: void, req: Request) => {
                return await getCategories(req.session.user!).catch(
                    (e: Error) => {
                        throw e
                    },
                )
            },
            getUser: async (_: void, req: Request) => {
                return await getUserById(req.session.user!).catch(
                    (e: Error) => {
                        throw e
                    },
                )
            },
            createItems: async (param: CreateItemsParam, req: Request) => {
                return await createItems(
                    req.session.user!,
                    param.json,
                    param.setPreSelect,
                ).catch((e: Error) => {
                    throw e
                })
            },
            getItems: async (param: GetItemsParam, req: Request) => {
                return await getItems(
                    req.session.user!,
                    param.year,
                    param.month,
                ).catch((e: Error) => {
                    throw e
                })
            },
            setDarkMode: async (param: SetDarkModeParam, req: Request) => {
                return await setDarkMode(
                    req.session.user!,
                    param.darkMode,
                ).catch((e: Error) => {
                    throw e
                })
            },
            getPreItems: async (param: PreItemsParam, req: Request) => {
                return await getPreItems(
                    req.session.user!,
                    param.rawText,
                    param.dateFormat,
                ).catch((e: Error) => {
                    throw e
                })
            },
            deleteItem: async (param: DeleteItemParam, req: Request) => {
                return await deleteItem(req.session.user!, param.itemId).catch(
                    (e: Error) => {
                        throw e
                    },
                )
            },
        },
        graphiql: true,
    }),
)

export { apiRouter }
