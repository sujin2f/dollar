import { useContext, useEffect } from 'react'
import { gql } from '@apollo/client'

import {
    ContextType,
    Context,
    getUserInit,
    getUserSuccess,
    getUserFailed,
} from 'src/client/store'
import { graphqlClient } from 'src/utils'
import { User, ApiState, WithApiState, Fn } from 'src/types'

type GetUserQueryParam = {
    getUser: User
}
type SetDarkMode = Fn<[boolean], void>

export const useUser = (): WithApiState<User> => {
    const [{ user }, dispatch] = useContext(Context) as ContextType

    useEffect(() => {
        if (user !== ApiState.NotAssigned) {
            return
        }

        dispatch(getUserInit())
        graphqlClient
            .query<GetUserQueryParam>({
                query: gql`
                    query {
                        getUser {
                            name
                            email
                            photo
                            darkMode
                        }
                    }
                `,
            })
            .then((response) => {
                dispatch(getUserSuccess(response.data.getUser))
            })
            .catch((e: Error) => {
                console.error(e.message)
                dispatch(getUserFailed())
            })
    }, [dispatch, user])

    return user
}

export const useDarkMode = (): SetDarkMode => {
    const [{ user }, dispatch] = useContext(Context) as ContextType

    const setDarkMode = (darkMode: boolean) => {
        graphqlClient
            .mutate({
                mutation: gql`
                    mutation {
                        setDarkMode(
                            darkMode: ${darkMode}
                        )
                    }
                `,
            })
            .then(() => {
                dispatch(getUserSuccess({ ...(user as User), darkMode }))
            })
            .catch((e: Error) => {
                console.error(e.message)
                console.error(e)
            })
    }

    return setDarkMode
}
