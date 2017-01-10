import { RECEIVE_PROFILE, FETCH_PROFILE_REQUEST, UPDATE_PROFILE_REQUEST, UPDATE_PROFILE_OK, UPDATE_PROFILE_KO, RECEIVE_PROFILE_KO } from '../constants'
import { createReducer } from '../utils/misc'

const initialState = {
    data: null,
    isFetching: false,
    loaded: false,
};

export default createReducer(initialState, {
    [RECEIVE_PROFILE]: (state, payload) =>
        Object.assign({}, state, {
            data: payload.data,
            isFetching: false,
            loaded: true,
            error: false,
        }),
    [FETCH_PROFILE_REQUEST]: (state) =>
        Object.assign({}, state, {
            isFetching: true,
        }),
    [RECEIVE_PROFILE_KO]: (state, payload) =>
        Object.assign({}, state, {
            isFetching: false,
            data: payload.data,
            loaded: false,
            error: true,
        }),


    [UPDATE_PROFILE_OK]: (state, payload) =>
        Object.assign({}, state, {
            data: payload.data,
            isUpdating: false,
            loaded: true,
            statusText: payload.statusText,
            statusType: payload.statusType,
            message_open: true,
        }),
    [UPDATE_PROFILE_KO]: (state, payload) =>
        Object.assign({}, state, {
            data: payload.data,
            isUpdating: false,
            loaded: true,
            status: payload.status,
            statusText: payload.statusText,
            statusType: payload.statusType,
            message_open: true,
        }),
    [UPDATE_PROFILE_REQUEST]: (state) =>
        Object.assign({}, state, {
            isUpdating: true,
        }),
});
