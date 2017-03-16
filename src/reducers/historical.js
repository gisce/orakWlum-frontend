import { RECEIVE_HISTORICAL, FETCH_HISTORICAL_REQUEST, FETCH_AGGREGATIONS_REQUEST, RECEIVE_AGGREGATIONS, RUN_HISTORICAL_REQUEST, RECEIVE_RUN_HISTORICAL, RECEIVE_RUN_HISTORICAL_ERROR } from '../constants';
import { createReducer } from '../utils/misc';

const initialState = {
    data: null,
    isFetching: false,
    loaded: false,
};

export default createReducer(initialState, {
    [FETCH_HISTORICAL_REQUEST]: (state,payload) =>
        Object.assign({}, state, {
            isFetching: true,
            message_text: payload.message,
        }),
    [RECEIVE_HISTORICAL]: (state, payload) =>
        Object.assign({}, state, {
            data: payload.data,
            allAggregations: payload.aggregations,
            isFetching: false,
            loaded: true,
            message_text: payload.message,
        }),



    [RUN_HISTORICAL_REQUEST]: (state,payload) =>
        Object.assign({}, state, {
            isFetching: true,
            message_text: payload.message,
        }),
    [RECEIVE_RUN_HISTORICAL]: (state, payload) =>
        Object.assign({}, state, {
            data: payload.data,
            allAggregations: payload.aggregations,
            isFetching: false,
            loaded: true,
            message_text: payload.message,
        }),
    [RECEIVE_RUN_HISTORICAL_ERROR]: (state, payload) =>
        Object.assign({}, state, {
            message_text: payload.message,
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
