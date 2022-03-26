// yarn test graphql.spec.ts
import request from 'supertest'
import { ObjectId } from 'mongodb'
import express, { Application } from 'express'
import { connect, close, clear } from 'src/jest/mongo'
import { graphqlRouter } from './graphql'
import { getOrAddUser } from '../utils/mongo/users'
import { Session } from 'express-session'
import { ItemParam, ItemsParam } from 'src/constants/graph-query'

describe('graphql.ts', () => {
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

    describe('user', () => {
        it('Session working', (done) => {
            request(app)
                .get('/')
                .send({
                    query: '{ user { name, email, photo, darkMode } }',
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .then((response) => {
                    expect(response.body.data.user.email).toBe(
                        'sujin.2f@gmail.com',
                    )
                    done()
                })
                .catch((err) => done(err))
        })

        it('🤬 Invalid Login', (done) => {
            userId = new ObjectId().toString()
            request(app)
                .get('/')
                .send({
                    query: '{ user {name, email, photo, darkMode} }',
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .then((response) => {
                    expect(
                        JSON.parse(response.text).errors[0].message,
                    ).toBeTruthy()
                    done()
                })
                .catch((err) => done(err))
        })

        it('🤬 No Login', (done) => {
            userId = ''
            request(app)
                .get('/')
                .send({
                    query: '{ user {name, email, photo, darkMode} }',
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .then((response) => {
                    expect(
                        JSON.parse(response.text).errors[0].message,
                    ).toBeTruthy()
                    done()
                })
                .catch((err) => done(err))
        })

        it('Mutation', (done) => {
            request(app)
                .post('/')
                .send({
                    query: `mutation {
                                user (user: {
                                    _id: "${userId}",
                                    darkMode: true
                                })
                            }`,
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .then((response) => {
                    expect(JSON.parse(response.text).data.user).toBeTruthy()
                    done()
                })
                .catch((err) => done(err))
        })
    })

    describe('items', () => {
        beforeAll(() => {
            const itemsUtil = require('../utils/mongo/items')
            itemsUtil.addItems = (arg: ItemsParam, _: unknown) => {
                if (arg.rawItems[0].title === 'rawItem') {
                    return 'success'
                }
                return 'fail'
            }
            itemsUtil.getItems = async (
                arg: Record<string, string>,
                _: unknown,
            ) => {
                return new Promise((resolve) => {
                    resolve([
                        {
                            _id: arg.year,
                            title: arg.month,
                            date: arg.type,
                        },
                    ])
                })
            }
        })

        it('Get', (done) => {
            request(app)
                .get('/')
                .send({
                    query: `{
                                items (
                                    year: 1977,
                                    month: 1,
                                    type: "type"
                                ) {
                                    _id
                                    title
                                    date
                                }
                            }`,
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .then((response) => {
                    const item = JSON.parse(response.text).data.items[0]
                    expect(item._id).toMatch('1977')
                    expect(item.title).toMatch('1')
                    expect(item.date).toMatch('type')
                    done()
                })
                .catch((err) => done(err))
        })

        it('Mutation', (done) => {
            request(app)
                .post('/')
                .send({
                    query: `mutation {
                                items (rawItems: [{
                                    title: "rawItem"
                                }])
                            }`,
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .then((response) => {
                    expect(JSON.parse(response.text).data.items).toMatch(
                        'success',
                    )
                    done()
                })
                .catch((err) => done(err))
        })
    })

    describe('item', () => {
        beforeAll(() => {
            const itemsUtil = require('../utils/mongo/items')
            itemsUtil.addItem = (arg: ItemParam, _: unknown) => {
                if (arg.rawItem.title === 'add') {
                    return 'success'
                }
                return 'fail'
            }
            itemsUtil.deleteItem = (arg: ItemParam, _: unknown) => {
                if (arg.rawItem.title === 'delete') {
                    return true
                }
                return false
            }
            itemsUtil.updateItem = (arg: ItemParam, _: unknown) => {
                if (arg.rawItem.title === 'update') {
                    return true
                }
                return false
            }
        })

        it('Update', (done) => {
            request(app)
                .post('/')
                .send({
                    query: `mutation {
                                item (
                                    rawItem: {
                                        title: "update"
                                    },
                                    type: "update"
                                )
                            }`,
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .then((response) => {
                    expect(JSON.parse(response.text).data.item).toMatch('true')
                    done()
                })
                .catch((err) => done(err))
        })

        it('Delete', (done) => {
            request(app)
                .post('/')
                .send({
                    query: `mutation {
                                item (
                                    rawItem: {
                                        title: "delete"
                                    },
                                    type: "delete"
                                )
                            }`,
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .then((response) => {
                    expect(JSON.parse(response.text).data.item).toMatch('true')
                    done()
                })
                .catch((err) => done(err))
        })

        it('Add', (done) => {
            request(app)
                .post('/')
                .send({
                    query: `mutation {
                                item (
                                    rawItem: {
                                        title: "add"
                                    },
                                    type: "add"
                                )
                            }`,
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .then((response) => {
                    expect(JSON.parse(response.text).data.item).toMatch(
                        'success',
                    )
                    done()
                })
                .catch((err) => done(err))
        })
    })
})
