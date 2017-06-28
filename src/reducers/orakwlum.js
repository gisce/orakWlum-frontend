import {RECEIVE_ELEMENTS, FETCH_ELEMENTS_REQUEST, OVERRIDE_ELEMENTS, OVERRIDE_MESSAGE, OVERRIDE_AGGREGATIONS, FETCH_AGGREGATIONS_REQUEST, RECEIVE_ELEMENTS_VOLATILE} from '../constants';
import {createReducer} from '../utils/misc';

//deepmerge lib
const deepmerge = require('deepmerge')

const initialState = {
    isFetching: false,
    loaded: false,
    message: "",
    aggregations: {},
    elements: {},
    elements_volatile: {},
    elements_by_date: {},
    elements_by_date: {},
};

export default createReducer(initialState, {
    [RECEIVE_ELEMENTS_VOLATILE]: (state, payload) => Object.assign({}, state, {
        elements_volatile: (state.elements_volatile == undefined || state.elements_volatile == null || Object.keys(state.elements_volatile).length == 0) ? payload.elements : deepmerge(state.elements_volatile, payload.elements),

        elements_by_type: (state.elements_by_type == undefined || state.elements_by_type == null || Object.keys(state.elements_by_type).length == 0) ? payload.by_type : deepmerge(state.elements_by_type, payload.by_type),

        elements_by_date: (state.elements_by_date == undefined || state.elements_by_date == null || Object.keys(state.elements_by_date).length == 0) ? payload.by_date : deepmerge(state.elements_by_date, payload.by_date),

        message: payload.message,
        isFetching: false,
        loaded: true
    }),
    [RECEIVE_ELEMENTS]: (state, payload) => Object.assign({}, state, {
        elements: (state.elements == undefined || state.elements == null || Object.keys(state.elements).length == 0) ? payload.elements : deepmerge(state.elements, payload.elements),
        
        elements_by_type: (state.elements_by_type == undefined || state.elements_by_type == null || Object.keys(state.elements_by_type).length == 0) ? payload.by_type : deepmerge(state.elements_by_type, payload.by_type),

        elements_by_date: (state.elements_by_date == undefined || state.elements_by_date == null || Object.keys(state.elements_by_date).length == 0) ? payload.by_date : deepmerge(state.elements_by_date, payload.by_date),

        message: payload.message,
        isFetching: false,
        loaded: true
    }),
    [OVERRIDE_ELEMENTS]: (state, payload) => Object.assign({}, state, {
        elements: payload.elements,
        message: payload.message,
        elements_by_type: payload.by_type,
        elements_by_date: payload.by_date,
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
