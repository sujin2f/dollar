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

ReactDOM.render(
    <React.StrictMode>
        <Router>
            <Store>
                <Switch>
                    <Redirect from="/#" to="/" />
                    <Route exact={true} path="/">
                        <PublicWrapper>
                            <PublicHome />
                        </PublicWrapper>
                    </Route>
                    <Route
                        exact={true}
                        path="/app/:type(daily|monthly)?/:year(\d+)?/:month(\d+)?"
                    >
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
                    <Route exact={true} path="/app/modify/:itemId">
                        <AppWrapper>
                            <AddItem />
                        </AppWrapper>
                    </Route>
                </Switch>
            </Store>
        </Router>
    </React.StrictMode>,
    document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register()
