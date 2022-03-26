import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from '@apollo/client/react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from 'react-router-dom'
import * as serviceWorker from 'src/client/serviceWorker'

import { Store } from 'src/client/store'
import { PublicWrapper, PublicHome } from 'src/client/scenes/public'
import { AppWrapper, AccountBook, AddItems } from 'src/client/scenes/app'
import { graphqlClient } from 'src/utils/graphql'

ReactDOM.render(
    <ApolloProvider client={graphqlClient}>
        <React.StrictMode>
            <Router>
                <Store>
                    <Switch>
                        {/* Public */}
                        <Redirect from="/#" to="/" />
                        <Route exact={true} path="/">
                            <PublicWrapper>
                                <PublicHome />
                            </PublicWrapper>
                        </Route>

                        <Route exact={true} path="/app/add/bulkAdd">
                            <AppWrapper>
                                <AddItems />
                            </AppWrapper>
                        </Route>

                        {/* Account Book */}
                        <Route path={`/app/:type?/:year(\\d+)?/:month(\\d+)?`}>
                            <AppWrapper>
                                <AccountBook />
                            </AppWrapper>
                        </Route>
                    </Switch>
                </Store>
            </Router>
        </React.StrictMode>
    </ApolloProvider>,
    document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register()
