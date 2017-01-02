import { createReducer } from '../utils/misc';

import {
    FETCH_VERSION_REQUEST,
    RECEIVE_VERSION,
    RECEIVE_VERSION_ERROR,
} from '../constants/index'


const initialState = {
    data: null,
    isFetching: false,
    loaded: false,
    message_text: null,
    message_open: false,
    error: false,
};

export default createReducer(initialState, {
    [FETCH_VERSION_REQUEST]: (state, payload) =>
        Object.assign({}, state, {
            isFetching: true,
            message_text: payload.message,
        }),

    [RECEIVE_VERSION]: (state, payload) =>
        Object.assign({}, state, {
            data: payload.data,
            isFetching: false,
            loaded: true,
            message_text: payload.message,
        }),

    [RECEIVE_VERSION_ERROR]: (state, payload) =>
        Object.assign({}, state, {
            error: true,
            isFetching: false,
            loaded: false,
            isFetching: false,
            message_text: payload.message,
            message_open: true,
        }),
});
