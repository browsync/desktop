import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';

import store from './utils/store';

import './index.css';
import Home from "./App"

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <div>
                <main>
                    <Route exact path="/" component={Home} />
                </main>
            </div>
        </Router>
    </Provider>
    , 
    document.getElementById("root")
)
