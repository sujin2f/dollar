// yarn test api.spec.ts

import request from 'supertest'
import express, { Application } from 'express'
import { connect, close, clear } from 'src/jest/mongo'
import { graphqlRouter } from './graphql'
import { getOrAddUser } from '../utils/mongo/users'
import { Session } from 'express-session'

describe('api.ts', () => {
    let userId: string
    const app: Application = express()

    beforeAll(async () => {
        await connect()

        app.use((req, res, next) => {
            req.session = {} as Session
            req.session.user = userId
            next()
        })
        app.use('/', graphqlRouter)
    })
    beforeEach(async () => {
        await clear()

        const user = await getOrAddUser('Sujin', 'sujin.2f@gmail.com')
        userId = user._id
    })
    afterAll(async () => {
        await close()
    })

    it('Session working', (done) => {
        request(app)
            .get('/')
            .send({
                query: '{ user {name, email, photo, darkMode} }',
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body.data.user.email).toBe('sujin.2f@gmail.com')
                done()
            })
            .catch((err) => done(err))
    })
})
