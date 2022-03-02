import express from 'express'
import { Session } from 'express-session'
import { User } from 'src/types'
import { getOrAddUser } from 'src/utils/mongo'
import { getGoogleAccountFromCode, GoogleLoginUrl } from 'src/utils/google-api'

declare module 'express-session' {
    interface Session {
        user?: string
    }
}

const authRouter = express.Router()

/**
 * Login
 * In dev server, it automatically log a user in credential in
 * Otherwise, it redirects to the Google login
 */
authRouter.get('/login', async (req, res) => {
    try {
        if (process.env.NODE_ENV !== 'production') {
            ;(req.session as Session).user = process.env.DEV_USER_ID
            res.redirect('/app')
            return
        }

        if ((req.session as Session).user) {
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
    ;(req.session as Session).user = undefined
    res.redirect('/')
})

/**
 * Google login redirected
 */
authRouter.get('/', async (req, res) => {
    if ((req.session as Session).user) {
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
                    ;(req.session as Session).user = user._id
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
