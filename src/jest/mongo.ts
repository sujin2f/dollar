import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

let mongo: MongoMemoryServer

export const mongoConnect = async (): Promise<typeof mongoose> => {
    const uri = 'mongodb://root:example@localhost:27017'
    const dbName = 'test'

    return mongoose
        .connect(uri || '', {
            dbName,
        })
        .then((db) => {
            return db
        })
        .catch(() => {
            throw new Error('')
        })
}

export const connect = async () => {
    mongo = await MongoMemoryServer.create()
    await mongoose.connect(mongo.getUri())
}

export const connectReal = async () => {
    await mongoConnect()
}

export const close = async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    await mongo.stop()
}

export const closeReal = async () => {
    await mongoose.connection.close()
}

export const clear = async () => {
    const collections = mongoose.connection.collections
    for (const collection of Object.values(collections)) {
        await collection.deleteMany({})
    }
}

// tslint:disable-next-line: no-empty
export const clearReal = async () => {}
