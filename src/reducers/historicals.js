import { RECEIVE_HISTORICALS, FETCH_HISTORICALS_REQUEST } from '../constants';
import { createReducer } from '../utils/misc';

const initialState = {
    data: null,
    isFetching: false,
    loaded: false,
};

export default createReducer(initialState, {
    [RECEIVE_HISTORICALS]: (state, payload) =>
        Object.assign({}, state, {
            data: payload.data,
            allAggregations: payload.aggregations,
            isFetching: false,
            loaded: true,
            message_text: payload.message,
        }),
    [FETCH_HISTORICALS_REQUEST]: (state, payload) =>
        Object.assign({}, state, {
            isFetching: true,
            message_text: payload.message,
        }),
});
