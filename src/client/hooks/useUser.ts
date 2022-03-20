import { useHistory } from 'react-router-dom'
import { useMutation, useQuery } from '@apollo/client'

import { Fields, GraphQuery, UserParam } from 'src/constants/graph-query'
import { useGlobalOption } from './useGlobalOption'
import { User } from 'src/types/model'

export const useUser = () => {
    const { setCallout } = useGlobalOption()
    const history = useHistory()
    const { loading, error, data } = useQuery<UserParam>(GraphQuery.GET_USER)

    if (error) {
        setCallout(error.message)
        history.push('/')
    }

    const [setUser] = useMutation(GraphQuery.SET_USER, {
        variables: {
            [Fields.USER]: {} as User,
        },
        refetchQueries: [GraphQuery.GET_USER],
        onError: (e) => {
            setCallout(e.message)
        },
    })

    return {
        loading,
        user: data ? data[Fields.USER] : data,
        setUser,
    }
}
