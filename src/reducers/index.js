import { routerReducer } from 'react-router-redux'
import { combineReducers } from 'redux'
import auth  from './auth'
import about  from './about'
import data  from './data'
import profile  from './profile'
import proposal  from './proposal'
import proposals  from './proposals'
import { LOGOUT_USER } from '../constants/index'

const appReducer = combineReducers({
    routing: routerReducer,
    auth,
    data,
    proposals,
    proposal,
    profile,
    about,
});

const rootReducer = (state, action) => {
  if (action.type === 'LOGOUT_USER') {
    // Clear all states except routing
    Object.keys(state).forEach(function(oneState,index) {
        if (oneState != "routing")
            state[oneState] = undefined;
    });
  }
  return appReducer(state, action);
}

export default rootReducer;
