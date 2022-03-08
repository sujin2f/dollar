import React from 'react'
import ReactDOM from 'react-dom'
import * as serviceWorker from 'src/client/serviceWorker'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from 'react-router-dom'
import { Store } from 'src/client/store'
import { PublicWrapper, PublicHome } from 'src/client/scenes/public'
import { AppWrapper, AppHome, AddItems, AddItem } from 'src/client/scenes/app'
import { ApolloProvider } from '@apollo/client/react'
import { graphqlClient } from 'src/utils'

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

                        {/* Account Book */}
                        <Route path="/app/:type(daily)?/:year(\d+)?/:month(\d+)?">
                            <AppWrapper>
                                <AppHome />
                            </AppWrapper>
                        </Route>

                        {/* Remove Item */}
                        <Route exact={true} path="/app/remove/:removeId">
                            <AppWrapper>
                                <AppHome />
                            </AppWrapper>
                        </Route>

                        <Route exact={true} path="/app/add">
                            <AppWrapper>
                                <AddItem />
                            </AppWrapper>
                        </Route>
                        <Route exact={true} path="/app/add/text">
                            <AppWrapper>
                                <AddItems />
                            </AppWrapper>
                        </Route>
                        <Route exact={true} path="/app/update/:itemId">
                            <AppWrapper>
                                <AddItem />
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
