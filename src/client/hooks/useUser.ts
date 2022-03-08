import { gql, useMutation, useQuery } from '@apollo/client'

import { User } from 'src/types/model'
import { useHistory } from 'react-router-dom'

type GetUserQueryParam = {
    getUser: User
}

const GET_USER = gql`
    query {
        getUser {
            name
            email
            photo
            darkMode
        }
    }
`
const SET_DARK_MODE = gql`
    mutation setDarkMode($darkMode: Boolean!) {
        setDarkMode(darkMode: $darkMode)
    }
`

export const useUser = () => {
    const history = useHistory()
    const {
        loading,
        error,
        data: getUserData,
    } = useQuery<GetUserQueryParam>(GET_USER)

    if (error) {
        alert(error.message)
        history.push('')
    }

    const [setDarkMode] = useMutation(SET_DARK_MODE, {
        variables: {
            darkMode: false,
        },
        refetchQueries: [GET_USER, 'getUser'],
    })

    return {
        loading,
        error,
        user: getUserData ? getUserData.getUser : getUserData,
        setDarkMode,
    }
}
