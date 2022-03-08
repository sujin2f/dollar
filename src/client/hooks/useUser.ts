import { useHistory } from 'react-router-dom'
import { useMutation, useQuery } from '@apollo/client'

import { User } from 'src/types/model'
import { GraphQuery } from 'src/client/const/graph-query'

type GetUserQueryParam = {
    getUser: User
}

export const useUser = () => {
    const history = useHistory()
    const { loading, error, data } = useQuery<GetUserQueryParam>(
        GraphQuery.GET_USER,
    )

    if (error) {
        console.log(error.message)
        history.push('/')
    }

    const [setDarkMode] = useMutation(GraphQuery.SET_DARK_MODE, {
        variables: {
            darkMode: false,
        },
        refetchQueries: [GraphQuery.GET_USER, 'getUser'],
        onError: (e) => {
            console.log(e)
        },
    })

    return {
        loading,
        user: data ? data.getUser : data,
        setDarkMode,
    }
}
