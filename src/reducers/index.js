import { routerReducer } from 'react-router-redux'
import { combineReducers } from 'redux'
import auth  from './auth'
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
});

const rootReducer = (state, action) => {
  if (action.type === 'LOGOUT_USER') {
    //state = undefined;
    state.auth = undefined;
    state.data = undefined;
    state.proposals = undefined;
    state.proposal = undefined;
    state.profile = undefined;
  }
  return appReducer(state, action);
}

export default rootReducer;
