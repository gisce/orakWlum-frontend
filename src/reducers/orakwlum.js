import {RECEIVE_ELEMENTS, FETCH_ELEMENTS_REQUEST, OVERRIDE_ELEMENTS, OVERRIDE_MESSAGE, OVERRIDE_AGGREGATIONS, FETCH_AGGREGATIONS_REQUEST} from '../constants';
import {createReducer} from '../utils/misc';

const initialState = {
    isFetching: false,
    loaded: false,
    message: "",
    elements: {},
    aggregations: {}
};

export default createReducer(initialState, {
    [RECEIVE_ELEMENTS]: (state, payload) => Object.assign({}, state, {
        elements: {
            ...state.elements,
            ...payload.elements
        },
        message: payload.message,
        isFetching: false,
        loaded: true
    }),
    [OVERRIDE_ELEMENTS]: (state, payload) => Object.assign({}, state, {
        elements: payload.elements,
        message: payload.message,
        isFetching: false,
        loaded: true
    }),
    [OVERRIDE_AGGREGATIONS]: (state, payload) => Object.assign({}, state, {
        aggregations: payload.aggregations,
        message: payload.message,
        isFetching: false,
        loaded: true
    }),
    [FETCH_AGGREGATIONS_REQUEST]: (state, payload) => Object.assign({}, state, {
        isFetching: true,
        message: payload.message
    }),
    [FETCH_ELEMENTS_REQUEST]: (state, payload) => Object.assign({}, state, {
        isFetching: true,
        message: payload.message
    }),

    [OVERRIDE_MESSAGE]: (state, payload) => Object.assign({}, state, {message: payload.message})
});
