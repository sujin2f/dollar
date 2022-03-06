import { ErrorMessages } from 'src/constants'
import { UserModel } from 'src/constants/mongo'
import { Nullable, User } from 'src/types'

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
