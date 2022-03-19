// yarn test users.spec.ts

import { Request } from 'express'
import { ObjectId } from 'mongodb'
import { connect, close, clear } from 'src/jest/mongo'
import { getOrAddUser, setDarkMode, getUserByEmail, getUser } from './users'

describe('users.ts', () => {
    const userId = new ObjectId().toString()
    const request = { session: { user: userId } } as Request

    beforeAll(async () => await connect())
    beforeEach(async () => await clear())
    afterAll(async () => await close())

    describe('getOrAddUser()', () => {
        it('Success', async () => {
            const user = await getOrAddUser('Sujin', 'sujin.2f@gmail.com')
            expect(user.name).toEqual('Sujin')
            expect(user.email).toEqual('sujin.2f@gmail.com')
        })

        it('🤬 Fail', async () => {
            await getOrAddUser('', '')
                .then(() => expect(false).toBeTruthy())
                .catch(() => expect(true).toBeTruthy())
        })
    })

    it('setDarkMode()', async () => {
        const user = await getOrAddUser('Sujin', 'sujin.2f@gmail.com')
        const darkMode = await setDarkMode({ darkMode: true }, {
            session: { user: user._id },
        } as Request)
        expect(darkMode).toEqual(true)
    })

    describe('getUserByEmail()', () => {
        it('Success', async () => {
            await getOrAddUser('Sujin', 'sujin.2f@gmail.com')
            const user = await getUserByEmail('sujin.2f@gmail.com')
            expect(user.name).toEqual('Sujin')
            expect(user.email).toEqual('sujin.2f@gmail.com')
        })

        it('🤬 Fail', async () => {
            await getUserByEmail('sujin.2f@gmail.com')
                .then(() => expect(false).toBeTruthy())
                .catch(() => expect(true).toBeTruthy())
        })
    })

    describe('getUser()', () => {
        it('Success', async () => {
            const user = await getOrAddUser('Sujin', 'sujin.2f@gmail.com')
            const sameUser = await getUser(undefined, {
                session: { user: user._id },
            } as Request)
            expect(sameUser.name).toEqual('Sujin')
            expect(sameUser.email).toEqual('sujin.2f@gmail.com')
        })

        it('🤬 Fail', async () => {
            await getUser(undefined, request)
                .then(() => expect(false).toBeTruthy())
                .catch(() => expect(true).toBeTruthy())
        })
    })
})
