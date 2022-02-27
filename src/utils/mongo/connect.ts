/**
 * MongoDB connection helpers
 */

import mongoose from 'mongoose'
import { ErrorMessages } from 'src/constants'

/**
 * MongoDB connect
 * @return {Promise<typeof mongoose>}
 * @throw Database connection failure
 */
export const mongoConnect = async (): Promise<typeof mongoose> => {
    const uri = process.env.MONGO_URI
    const dbName = process.env.MONGO_DATABASE

    return mongoose
        .connect(uri || '', {
            dbName,
        })
        .then((db) => {
            return db
        })
        .catch(() => {
            throw new Error(ErrorMessages.MONGO_FAILED)
        })
}
