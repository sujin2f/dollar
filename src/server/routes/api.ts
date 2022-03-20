import express, { Request, Response, NextFunction } from 'express'
import { graphqlHTTP } from 'express-graphql'
import { schema, UserParam } from 'src/constants/graph-query'
import { ErrorMessages } from 'src/server/constants/messages'

import {
    setUser,
    getUser,
    categories,
    updateCategory,
    getItems,
    rawItems,
    addItems,
    addItem,
    deleteItem,
    updateItem,
} from 'src/server/utils/mongo'

const apiRouter = express.Router()

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

const isMutation = (res: any) => {
    return res.path.typename === 'Mutation'
}

apiRouter.use(
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
            categories,
            updateCategory,
            getItems,
            rawItems,
            addItems,
            addItem,
            deleteItem,
            updateItem,
        },
        graphiql: true,
    }),
)

export { apiRouter }
