import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

let mongo: MongoMemoryServer

export const connect = async () => {
    mongo = await MongoMemoryServer.create()
    await mongoose.connect(mongo.getUri())
}

export const close = async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    await mongo.stop()
}

export const clear = async () => {
    const collections = mongoose.connection.collections
    for (const collection of Object.values(collections)) {
        await collection.deleteMany({})
    }
}
