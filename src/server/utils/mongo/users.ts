import { Request } from 'express'
import mongoose, { Schema } from 'mongoose'
import { UserParam } from 'src/constants/graph-query'
import { ErrorMessages } from 'src/server/constants/messages'
import { User } from 'src/types/model'

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

export const setUser = async (
    { user: { darkMode } }: UserParam,
    { session: { user } }: Request,
): Promise<boolean> => {
    await UserModel.updateOne({ _id: user }, { darkMode }).catch(
        /* istanbul ignore next */ () => {
            throw new Error(ErrorMessages.SOMETHING_WENT_WRONG)
        },
    )
    return darkMode || false
}
