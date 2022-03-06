import express, { Request, Response, NextFunction } from 'express'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'graphql'

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

const loggingMiddleware = (req: Request, _: Response, next: NextFunction) => {
    next()
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
                return await getCategories(req.session.user).catch(
                    (e: Error) => {
                        console.error(e.message)
                        throw e
                    },
                )
            },
            getUser: async (_: void, req: Request) => {
                return await getUserById(req.session.user).catch((e: Error) => {
                    console.error(e.message)
                    throw e
                })
            },
            createItems: async (param: CreateItemsParam, req: Request) => {
                return await createItems(
                    param.json,
                    param.setPreSelect,
                    req.session.user,
                ).catch((e: Error) => {
                    console.error(e.message)
                    throw e
                })
            },
            getItems: async (param: GetItemsParam, req: Request) => {
                return await getItems(
                    param.year,
                    param.month,
                    req.session.user,
                ).catch((e: Error) => {
                    console.error(e.message)
                    throw e
                })
            },
            setDarkMode: async (param: SetDarkModeParam, req: Request) => {
                return await setDarkMode(
                    param.darkMode,
                    req.session.user,
                ).catch((e: Error) => {
                    console.error(e.message)
                    throw e
                })
            },
            getPreItems: async (param: PreItemsParam, req: Request) => {
                return await getPreItems(
                    param.rawText,
                    param.dateFormat,
                    req.session.user,
                ).catch((e: Error) => {
                    console.error(e.message)
                    throw e
                })
            },
            deleteItem: async (param: DeleteItemParam, req: Request) => {
                return await deleteItem(param.itemId, req.session.user).catch(
                    (e: Error) => {
                        console.error(e.message)
                        throw e
                    },
                )
            },
        },
        graphiql: true,
    }),
)

export { apiRouter }
