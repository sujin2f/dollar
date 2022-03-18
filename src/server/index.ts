import moduleAlias from 'module-alias'
import express, { Application } from 'express'
import path from 'path'
import session from 'express-session'
import ConnectMongoDBSession from 'connect-mongodb-session'
import http from 'http'
import { config as detEnvConfig } from 'dotenv'
import { baseDir } from 'src/server/utils/environment'

// Alias
if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'stage') {
    moduleAlias.addAlias('src', baseDir)
    moduleAlias()
}

/* eslint-disable import/first */
import { ErrorMessages } from 'src/server/constants/messages'
import { mongoConnect } from 'src/server/utils/mongo'

import { authRouter, staticRouter, apiRouter } from 'src/server/routes'
/* eslint-enable import/first */

const app: Application = express()
const server = http.createServer(app)
let port: number = 8080
switch (process.env.NODE_ENV) {
    case 'production':
        port = 80
        break
    case 'stage':
        port = 8000
        break
    default:
        port = 8080
        break
}

/**
 * .env
 */
const envPath =
    process.env.NODE_ENV !== 'production'
        ? undefined
        : path.resolve(__dirname, '../', '../', '../', '.env.production')
detEnvConfig({ path: envPath })

/**
 * Session
 */
const MongoDBStore = ConnectMongoDBSession(session)
const store = new MongoDBStore({
    uri: process.env.MONGO_URI || '',
    collection: 'sessions',
})

/* tslint:disable no-console */
store.on('error', (e: Error) => {
    console.log(e)
})

const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET || '',
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 100, // 100 years
    },
    store,
    // Boilerplate options, see:
    // * https://www.npmjs.com/package/express-session#resave
    // * https://www.npmjs.com/package/express-session#saveuninitialized
    resave: true,
    saveUninitialized: true,
})
app.use(sessionMiddleware)

/**
 * Router
 */
app.use('/auth', authRouter)
app.use('/api', apiRouter)
app.use('/', staticRouter)

// start the Express server
server.listen(port, (): void => {
    console.log(`🤩 Server started at http://localhost:${port}`)
    mongoConnect()
        .then(() => console.log('🤩 Mongo DB connected'))
        .catch(() => console.error(ErrorMessages.MONGO_FAILED))
})
