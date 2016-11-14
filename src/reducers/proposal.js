import { RECEIVE_PROPOSAL, FETCH_PROPOSAL_REQUEST, FETCH_AGGREGATIONS_REQUEST, RECEIVE_AGGREGATIONS } from '../constants';
import { createReducer } from '../utils/misc';

const initialState = {
    data: null,
    isFetching: false,
    loaded: false,
};

export default createReducer(initialState, {
    [RECEIVE_PROPOSAL]: (state, payload) =>
        Object.assign({}, state, {
            data: payload.data,
            isFetching: false,
            loaded: true,
        }),
    [FETCH_PROPOSAL_REQUEST]: (state) =>
        Object.assign({}, state, {
            isFetching: true,
        }),
    [RECEIVE_AGGREGATIONS]: (state, payload) =>
        Object.assign({}, state, {
            aggregations_list: payload.data,
            isFetching: false,
            loaded: true,
        }),
    [FETCH_AGGREGATIONS_REQUEST]: (state) =>
        Object.assign({}, state, {
            isFetching: true,
            loaded: false,
        }),

});
