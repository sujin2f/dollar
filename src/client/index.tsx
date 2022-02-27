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
import { Public } from './scenes'

ReactDOM.render(
    <React.StrictMode>
        <Router>
            <Store>
                <Switch>
                    <Redirect from="/#" to="/" />
                    <Route exact={false} path="/">
                        <Public />
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
