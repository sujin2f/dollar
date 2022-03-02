import mongoose, { Schema } from 'mongoose'
import { ErrorMessages } from 'src/constants'
import { Nullable, User } from 'src/types'

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    photo: String,
    darkMode: Boolean,
})

export const UserModel = mongoose.model<User>('user', userSchema)

export const getUserByEmail = async (email: string): Promise<User> => {
    return await UserModel.findOne({ email })
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

export const getUserById = async (_id?: string): Promise<Nullable<User>> => {
    if (!_id) {
        return
    }
    return await UserModel.findOne({ _id })
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
        const user = new UserModel({
            email,
            name,
            photo,
        })

        return await user.save()
    })

    return result as User
}

export const setDarkMode = async (
    darkMode: boolean,
    _id?: string,
): Promise<boolean> => {
    const result = await UserModel.updateOne({ _id }, { darkMode }).catch(
        () => {
            throw new Error(ErrorMessages.AUTHENTICATION_FAILED)
        },
    )
    if (result.modifiedCount) {
        return darkMode
    }
    throw new Error(ErrorMessages.AUTHENTICATION_FAILED)
}
