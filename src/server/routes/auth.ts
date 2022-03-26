import express from 'express'
import { User } from 'src/types/model'
import { getOrAddUser } from 'src/server/utils/mongo'
import {
    getGoogleAccountFromCode,
    GoogleLoginUrl,
} from 'src/server/utils/google-api'

const authRouter = express.Router()

/**
 * Login
 * In dev server, it automatically log a user in credential in
 * Otherwise, it redirects to the Google login
 */
authRouter.get('/login', async (req, res) => {
    if (process.env.NODE_ENV !== 'production') {
        req.session.user = process.env.DEV_USER_ID || ''
        res.redirect('/app')
        return
    }

    try {
        if (req.session.user) {
            res.redirect('/app')
        }
        res.redirect(GoogleLoginUrl())
        return
    } catch (_) {
        res.redirect('/auth/error')
    }
})

/**
 * Logout
 */
authRouter.get('/logout', (req, res) => {
    req.session.user = ''
    res.redirect('/')
})

/**
 * Google login redirected
 */
authRouter.get('/', async (req, res) => {
    if (req.session.user) {
        res.redirect('/app')
    }

    const code = req.query.code as string

    if (!code || !req.session) {
        res.redirect('/auth/error')
        return
    }

    await getGoogleAccountFromCode(code)
        .then((account: User) => {
            getOrAddUser(account.name, account.email, account.photo)
                .then((user: User) => {
                    req.session.user = user._id
                    res.redirect('/app')
                })
                .catch(() => {
                    res.redirect('/auth/error')
                })
        })
        .catch(() => {
            res.redirect('/auth/error')
        })
})

export { authRouter }
