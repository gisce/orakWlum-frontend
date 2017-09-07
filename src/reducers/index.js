import { routerReducer } from 'react-router-redux'
import { combineReducers } from 'redux'
import auth  from './auth'
import orakwlum  from './orakwlum'
import password  from './password'
import { LOGOUT_USER } from '../constants/index'

const appReducer = combineReducers({
    routing: routerReducer,
    orakwlum,
    auth,
    password,
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
