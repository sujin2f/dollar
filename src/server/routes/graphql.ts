import express, { Request, Response, NextFunction } from 'express'
import { graphqlHTTP } from 'express-graphql'
import {
    ItemParam,
    ItemsParam,
    schema,
    UserParam,
} from 'src/constants/graph-query'
import { ErrorMessages } from 'src/server/constants/messages'

import {
    setUser,
    getUser,
    categories,
    category,
    rawItems,
    getItems,
    addItems,
    addItem,
    deleteItem,
    updateItem,
} from 'src/server/utils/mongo'

const graphqlRouter = express.Router()

const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (req.session.user) {
        next()
        return
    }

    res.send({
        errors: [{ message: ErrorMessages.AUTHENTICATION_FAILED }],
    })
}
graphqlRouter.use(loggingMiddleware)

const isMutation = (res: any) => {
    return res.path.typename === 'Mutation'
}

graphqlRouter.use(
    '/',
    graphqlHTTP({
        schema,
        rootValue: {
            user: async (param: UserParam, req: Request, res: Response) => {
                if (isMutation(res)) {
                    return await setUser(param, req)
                }
                return await getUser(undefined, req)
            },
            rawItems,
            categories,
            category,
            items: async (param: ItemsParam, req: Request, res: Response) => {
                if (isMutation(res)) {
                    return await addItems(param, req)
                }
                return await getItems(param, req)
            },
            item: async (param: ItemParam, req: Request, res: Response) => {
                switch (param.type) {
                    case 'add':
                        return await addItem(param, req)
                    case 'update':
                        return await updateItem(param, req)
                    case 'delete':
                        return await deleteItem(param, req)
                }
            },
        },
        graphiql: true,
    }),
)

export { graphqlRouter }
