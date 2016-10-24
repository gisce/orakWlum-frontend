import { RECEIVE_PROFILE, FETCH_PROFILE_REQUEST } from '../constants'
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
        }),
    [FETCH_PROFILE_REQUEST]: (state) =>
        Object.assign({}, state, {
            isFetching: true,
        }),
});
