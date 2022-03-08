import { Request } from 'express'
import mongoose, { Schema } from 'mongoose'
import { ErrorMessages } from 'src/server/constants/messages'
import { User } from 'src/types/model'

declare module 'express-session' {
    interface Session {
        user?: string
    }
}

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

export const getUser = async (_: void, req: Request): Promise<User> => {
    return await UserModel.findOne({ _id: req.session.user })
        .then((user) => {
            if (!user) {
                throw new Error(ErrorMessages.FIND_USER_FAILED)
            }
            return user
        })
        .catch(() => {
            throw new Error(ErrorMessages.FIND_USER_FAILED)
        })
}

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

type SetDarkModeParam = {
    darkMode: boolean
}
export const setDarkMode = async (
    param: SetDarkModeParam,
    req: Request,
): Promise<boolean> => {
    const result = await UserModel.updateOne(
        { _id: req.session.user },
        { darkMode: param.darkMode },
    ).catch(() => {
        throw new Error(ErrorMessages.AUTHENTICATION_FAILED)
    })
    if (result.modifiedCount) {
        return param.darkMode
    }
    throw new Error(ErrorMessages.AUTHENTICATION_FAILED)
}
