import { routerReducer } from 'react-router-redux'
import { combineReducers } from 'redux'
import auth  from './auth'
import about  from './about'
import data  from './data'
import profile  from './profile'
import proposal  from './proposal'
import proposals  from './proposals'
import historical from './historical'
import historicals from './historicals'
import aggregations  from './aggregations'
import password  from './password'
import settings  from './settings'
import elements  from './elements'
import orakwlum  from './orakwlum'
import { LOGOUT_USER } from '../constants/index'

const appReducer = combineReducers({
    routing: routerReducer,
    orakwlum,
    auth,
    //data,
    //proposals,
    //proposal,
    //aggregations,
    //profile,
    //about,
    //password,
    //historical,
    //historicals,
    //elements,
    //settings,
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
