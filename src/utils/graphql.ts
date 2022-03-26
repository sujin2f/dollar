/* istanbul ignore file */

import fetch from 'cross-fetch'
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'

export const graphqlClient = new ApolloClient({
    link: new HttpLink({ uri: '/graphql', fetch }),
    cache: new InMemoryCache(),
})
