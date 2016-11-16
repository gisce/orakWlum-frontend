import { routerReducer } from 'react-router-redux'
import { combineReducers } from 'redux'
import auth  from './auth'
import data  from './data'
import profile  from './profile'
import proposal  from './proposal'
import proposals  from './proposals'

const appReducer = combineReducers({
    routing: routerReducer,
    auth,
    data,
    proposals,
    proposal,
    profile,
});

const rootReducer = (state, action) => {
  return appReducer(state, action)
}

export default rootReducer;
