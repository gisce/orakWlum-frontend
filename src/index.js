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

//Prepare Redux rehydration
import {persistStore} from 'redux-persist';

require('expose?$!expose?jQuery!jquery');
require('bootstrap-webpack');

//SW installation handling version updates!
OfflinePluginRuntime.install({
    onUpdateReady: () => OfflinePluginRuntime.applyUpdate(),
    onUpdated: () => window.softwareUpdate = true,
});

//Tap event plugin
injectTapEventPlugin();
const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

//AppProvider class with rehydration handling
class AppProvider extends React.Component {
  constructor() {
    super()
    this.state = { rehydrated: false }
  }

  componentWillMount(){
    persistStore(store, {}, () => {
      this.setState({ rehydrated: true })
    })
  }

  render() {
	//Show loadingAnimation until store is rehydrated
    if(!this.state.rehydrated){
		return (
			<div>Loading okW...</div>
		)
    }

    return (
		<Provider store={store}>
			<Router history={history}>
				<Redirect from="/" to="elements" />
				{routes}
			</Router>
		</Provider>
    )
  }
}

const the_app = <AppProvider />;

//Render the app!
ReactDOM.render(
	the_app,
    document.getElementById('root')
);
