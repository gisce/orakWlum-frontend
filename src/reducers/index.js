import { routerReducer } from 'react-router-redux'
import { combineReducers } from 'redux'
import auth  from './auth'
import data  from './data'
import profile  from './profile'
import proposal  from './proposal'
import proposals  from './proposals'

const rootReducer = combineReducers({
    routing: routerReducer,
    auth,
    data,
    proposals,
    proposal,
    profile,
});

export default rootReducer;
