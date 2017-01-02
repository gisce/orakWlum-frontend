import { RECEIVE_PROPOSALS, FETCH_PROPOSALS_REQUEST } from '../constants';
import { createReducer } from '../utils/misc';

const initialState = {
    data: null,
    isFetching: false,
    loaded: false,
};

export default createReducer(initialState, {
    [RECEIVE_PROPOSALS]: (state, payload) =>
        Object.assign({}, state, {
            data: payload.data,
            allAggregations: payload.aggregations,
            isFetching: false,
            loaded: true,
        }),
    [FETCH_PROPOSALS_REQUEST]: (state, payload) =>
        Object.assign({}, state, {
            isFetching: true,
            message_text: payload.message,
        }),
});
