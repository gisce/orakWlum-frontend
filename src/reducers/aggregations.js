import { FETCH_AGGREGATIONS_REQUEST, RECEIVE_AGGREGATIONS } from '../constants';
import { createReducer } from '../utils/misc';

const initialState = {
    aggregations_list: null,
    isFetching: false,
    loaded: false,
};

export default createReducer(initialState, {
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
