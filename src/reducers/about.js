import { createReducer } from '../utils/misc';

import {
    FETCH_PR_REQUEST,
    RECEIVE_PR,
    RECEIVE_PR_ERROR,
} from '../constants/index'


const initialState = {
    data: null,
    isFetching: false,
    loaded: false,
};

export default createReducer(initialState, {
    [FETCH_PR_REQUEST]: (state, payload) =>
        Object.assign({}, state, {
            isFetching: true,
            message_text: payload.message,
        }),
        
    [RECEIVE_PR]: (state, payload) =>
        Object.assign({}, state, {
            data: payload.data,
            isFetching: false,
            loaded: true,
            message_text: payload.message,
        }),

    [RECEIVE_PR_ERROR]: (state, payload) =>
        Object.assign({}, state, {
            isFetching: true,
            loaded: true,
            isFetching: false,
            message_text: payload.message,
        }),
});
