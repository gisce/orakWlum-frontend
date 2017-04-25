import { RECEIVE_SETTINGS, FETCH_SETTINGS_REQUEST, UPDATE_SETTINGS_REQUEST, UPDATE_SETTINGS_OK, UPDATE_SETTINGS_KO, RECEIVE_SETTINGS_KO } from '../constants'
import { createReducer } from '../utils/misc'

const initialState = {
    data: null,
    isFetching: false,
    loaded: false,
};

export default createReducer(initialState, {
    [RECEIVE_SETTINGS]: (state, payload) =>
        Object.assign({}, state, {
            data: payload.data,
            isFetching: false,
            loaded: true,
            error: false,
        }),
    [FETCH_SETTINGS_REQUEST]: (state) =>
        Object.assign({}, state, {
            isFetching: true,
        }),
    [RECEIVE_SETTINGS_KO]: (state, payload) =>
        Object.assign({}, state, {
            isFetching: false,
            data: payload.data,
            loaded: false,
            error: true,
        }),


    [UPDATE_SETTINGS_OK]: (state, payload) =>
        Object.assign({}, state, {
            data: payload.data,
            isUpdating: false,
            loaded: true,
            statusText: payload.statusText,
            statusType: payload.statusType,
            message_open: true,
        }),
    [UPDATE_SETTINGS_KO]: (state, payload) =>
        Object.assign({}, state, {
            data: payload.data,
            isUpdating: false,
            loaded: true,
            status: payload.status,
            statusText: payload.statusText,
            statusType: payload.statusType,
            message_open: true,
        }),
    [UPDATE_SETTINGS_REQUEST]: (state) =>
        Object.assign({}, state, {
            isUpdating: true,
        }),
});
