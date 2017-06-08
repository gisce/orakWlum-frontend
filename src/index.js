import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Redirect, browserHistory } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { syncHistoryWithStore } from 'react-router-redux';

//SW
import * as OfflinePluginRuntime from 'offline-plugin/runtime';

import configureStore from './store/configureStore';
import routes from './routes';
import './style.scss';

require('expose?$!expose?jQuery!jquery');
require('bootstrap-webpack');

//SW installation
OfflinePluginRuntime.install();

injectTapEventPlugin();
const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Redirect from="/" to="elements" />
            {routes}
        </Router>
    </Provider>,
    document.getElementById('root')
);
