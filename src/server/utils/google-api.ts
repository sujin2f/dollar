/**
 * Google API helpers
 * @see https://medium.com/@jackrobertscott/how-to-use-google-auth-api-with-node-js-888304f7e3a0
 * @see https://developers.google.com/people/quickstart/nodejs
 */

import { google } from 'googleapis'
import { OAuth2Client } from 'googleapis-common'
import { Credentials } from 'google-auth-library'
import { User } from 'src/types'
import { ErrorMessages } from 'src/constants'

/**
 * Create an OAuth2 client with the given credentials
 * @return {OAuth2Client | string}
 */
const createConnection = (): OAuth2Client => {
    return new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.REDIRECT_URL,
    )
}

/**
 * Get connection URL
 * @parm {OAuth2Client} auth An authorized OAuth2 client
 * @return {string} URL
 */
const getConnectionUrl = (auth: OAuth2Client): string => {
    return auth.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
        ],
    })
}

/**
 * Get tokens from returning code
 * @parm {string} code Returning code from auth URL
 * @return {Promise<Credentials>}
 * @throws
 */
const getToken = async (code: string): Promise<Credentials> => {
    const auth = createConnection()
    const data = await auth.getToken(code).catch(() => {
        throw Error(ErrorMessages.CANNOT_FIND_TOKEN)
    })
    return data.tokens
}

/**
 * Get Google login URL if it's available
 * @return {string} URL
 */
export const GoogleLoginUrl = (): string => {
    const auth = createConnection()
    const url = getConnectionUrl(auth)
    return url
}

/**
 * Get Google account information from the given code
 * Used by redirect URL
 * @param {string} code
 * @return {Promise<User>}
 * @throws Google token getting failed
 * @throws Retrieve Google account information failed
 * @throws Google account email or name is missing
 */
export const getGoogleAccountFromCode = async (code: string): Promise<User> => {
    const auth = createConnection()
    const tokens = await getToken(code).catch((e) => {
        throw e
    })

    auth.setCredentials(tokens)
    const service = google.people({ version: 'v1', auth })

    const me = await service.people
        .get({
            personFields: 'emailAddresses,names,photos',
            resourceName: 'people/me',
        })
        .catch((e) => {
            throw e
        })

    const email =
        me.data.emailAddresses &&
        me.data.emailAddresses[0] &&
        me.data.emailAddresses[0].value
    const name =
        me.data.names && me.data.names[0] && me.data.names[0].displayName
    const photo = me.data.photos && me.data.photos[0] && me.data.photos[0].url

    if (!email || !name) {
        throw Error(ErrorMessages.GOOGLE_ACCOUNT_FAILED)
    }

    return {
        _id: '',
        email,
        name,
        photo: photo || '',
    }
}
