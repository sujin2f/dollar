import mongoose, { Schema } from 'mongoose'
import { ErrorMessages } from 'src/constants'
import { User } from 'src/types'

const usersSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        required: false,
    },
    darkMode: {
        type: Boolean,
        required: false,
    },
})

const UsersModel = mongoose.model<User>('user', usersSchema)

export const getUserByEmail = async (email: string): Promise<User> => {
    return await UsersModel.findOne({ email })
        .then((user) => {
            if (!user) {
                throw new Error(ErrorMessages.AUTHENTICATION_FAILED)
            }
            return user
        })
        .catch(() => {
            throw new Error(ErrorMessages.AUTHENTICATION_FAILED)
        })
}

export const getUserById = async (_id: string): Promise<User> => {
    return await UsersModel.findOne({ _id })
        .then((user) => {
            if (!user) {
                throw new Error(ErrorMessages.AUTHENTICATION_FAILED)
            }
            return user
        })
        .catch(() => {
            throw new Error(ErrorMessages.AUTHENTICATION_FAILED)
        })
}

export const getOrAddUser = async (
    name: string,
    email: string,
    photo?: string,
): Promise<User> => {
    const result = await getUserByEmail(email).catch(async () => {
        const user = new UsersModel({
            email,
            name,
            photo,
        })

        return await user.save()
    })

    return result as User
}

export const setDarkMode = async (
    _id: string,
    darkMode: boolean,
): Promise<boolean> => {
    const result = await UsersModel.updateOne({ _id }, { darkMode }).catch(
        () => {
            throw new Error(ErrorMessages.AUTHENTICATION_FAILED)
        },
    )
    if (result.modifiedCount) {
        return darkMode
    }
    throw new Error(ErrorMessages.AUTHENTICATION_FAILED)
}
