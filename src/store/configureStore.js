import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware  from 'redux-thunk'
import rootReducer  from '../reducers'

import RavenMiddleware from 'redux-raven-middleware';

const DSN = "https://545e27e7709d4f28b2388faf97ebb05b@sentry.io/162486";

const createStoreWithMiddleware = applyMiddleware(
  RavenMiddleware(DSN)
)(createStore);


const debugware = [];
if (process.env.NODE_ENV !== 'production') {
    const createLogger = require('redux-logger');

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
