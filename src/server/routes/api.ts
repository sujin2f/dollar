import express, { Request, Response, NextFunction } from 'express'
import { graphqlHTTP } from 'express-graphql'
import { schema } from 'src/constants/graph-query'
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
