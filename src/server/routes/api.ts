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

type createItemsParam = {
    json: string
}

type setDarkModeParam = {
    darkMode: boolean
}

type preItemsParam = {
    rawText: string
    dateFormat: string
}

apiRouter.use(
    '/',
    graphqlHTTP({
        schema,
        rootValue: {
            getCategories: (_: void, req: Request) => {
                return getCategories(req.session.user)
            },
            getUser: (_: void, req: Request) => {
                return getUserById(req.session.user)
            },
            createItems: (param: createItemsParam, req: Request) => {
                return createItems(param.json, req.session.user)
            },
            getItems: (_: void, req: Request) => {
                return getItems(req.session.user)
            },
            setDarkMode: (param: setDarkModeParam, req: Request) => {
                return setDarkMode(param.darkMode, req.session.user)
            },
            getPreItems: (param: preItemsParam, req: Request) => {
                return getPreItems(
                    param.rawText,
                    param.dateFormat,
                    req.session.user,
                )
            },
        },
        graphiql: true,
    }),
)

export { apiRouter }
