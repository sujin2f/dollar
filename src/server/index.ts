import moduleAlias from 'module-alias'
import express, { Application, NextFunction, Request, Response } from 'express'
import path from 'path'
import session from 'express-session'
import ConnectMongoDBSession from 'connect-mongodb-session'
import http from 'http'
import { Server } from 'socket.io'
import { config as detEnvConfig } from 'dotenv'

import { baseDir } from '../utils/environment'
// Alias
if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'stage') {
    moduleAlias.addAlias('src', baseDir)
    moduleAlias()
}

/* eslint-disable import/first */
import { mongoConnect } from '../utils'
import { authRouter } from './routes/auth'
import { ErrorMessages } from '../constants'
import { staticRouter } from './routes/static'
import { socketListener } from './socket'

/* tslint:disable no-console */
declare module 'express-session' {
    interface Session {
        user?: string
    }
}

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
 * Socket.io
 */
const io = new Server(server)
io.use((socket, next) => {
    return sessionMiddleware(
        socket.request as Request,
        {} as Response,
        next as NextFunction,
    )
})

io.on('connection', socketListener)

/**
 * Router
 */
app.use('/auth', authRouter)
app.use('/', staticRouter)

// start the Express server
server.listen(port, (): void => {
    console.log(`🤩 Server started at http://localhost:${port}`)
    mongoConnect()
        .then(() => console.log('🤩 Mongo DB connected'))
        .catch(() => console.error(ErrorMessages.MONGO_FAILED))
})
