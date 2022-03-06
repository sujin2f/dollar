import express, { Request, Response, NextFunction } from 'express'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'graphql'

import { graphqlSchema } from 'src/constants'
import {
    getItems,
    createItems,
    getCategories,
    getUserById,
    setDarkMode,
    getPreItems,
    deleteItem,
} from 'src/utils/mongo'

declare module 'express-session' {
    interface Session {
        user?: string
    }
}

const apiRouter = express.Router()
const schema = buildSchema(graphqlSchema)

const loggingMiddleware = (req: Request, _: Response, next: NextFunction) => {
    next()
}
apiRouter.use(loggingMiddleware)

type CreateItemsParam = {
    json: string
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
                return await createItems(param.json, req.session.user).catch(
                    (e: Error) => {
                        console.error(e.message)
                        throw e
                    },
                )
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
