import { useHistory } from 'react-router-dom'
import { useMutation, useQuery } from '@apollo/client'

import { User } from 'src/types/model'
import { GraphQuery } from 'src/client/constants/graph-query'
import { useGlobalOption } from './useGlobalOption'

type GetUserQueryParam = {
    getUser: User
}

export const useUser = () => {
    const { setCallout } = useGlobalOption()
    const history = useHistory()
    const { loading, error, data } = useQuery<GetUserQueryParam>(
        GraphQuery.GET_USER,
    )

    if (error) {
        setCallout(error.message)
        history.push('/')
    }

    const [setDarkMode] = useMutation(GraphQuery.SET_DARK_MODE, {
        variables: {
            darkMode: false,
        },
        refetchQueries: [GraphQuery.GET_USER, 'getUser'],
        onError: (e) => {
            setCallout(e.message)
        },
    })

    return {
        loading,
        user: data ? data.getUser : data,
        setDarkMode,
    }
}
