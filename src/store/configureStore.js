import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware  from 'redux-thunk'
import { createLogger } from 'redux-logger';

import rootReducer  from '../reducers'

import Raven from "raven-js";
import createRavenMiddleware from "raven-for-redux";

import { DSN } from '../settings/index'
Raven.config(DSN).install();

const debugware = [];
if (process.env.NODE_ENV !== 'production') {
    debugware.push(createLogger({
        collapsed: true,
    }));
}

export default function configureStore(initialState) {

    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    const store = createStore(
        rootReducer,
        initialState,
        composeEnhancers(
            applyMiddleware(
                thunkMiddleware,
                ...debugware,
                createRavenMiddleware(Raven)
            )
        )
    );

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers', () => {
            const nextRootReducer = require('../reducers/index').default;

            store.replaceReducer(nextRootReducer);
        });
    }

    return store;
}
