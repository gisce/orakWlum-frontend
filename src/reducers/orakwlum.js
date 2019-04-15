import {localized_time, UPDATE_CALENDAR_DATE, RECEIVE_ELEMENTS, FETCH_ELEMENTS_REQUEST, OVERRIDE_ELEMENTS, OVERRIDE_MESSAGE, OVERRIDE_AGGREGATIONS, FETCH_AGGREGATIONS_REQUEST, RECEIVE_ELEMENTS_VOLATILE, RECEIVE_SETTINGS, UPDATE_SETTINGS_REQUEST, RECEIVE_PROFILE, FETCH_PROFILE_REQUEST, UPDATE_PROFILE_REQUEST, UPDATE_PROFILE_OK, UPDATE_PROFILE_KO, RECEIVE_PROFILE_KO, FETCH_VERSION_REQUEST, RECEIVE_VERSION, UPDATE_TUNED_VALUES} from '../constants';
import {createReducer} from '../utils/misc';

//deepmerge lib
const deepmerge = require('deepmerge')

const initialState = {
    calendar_date: localized_time().toDate(),
    isFetching: false,
    loaded: false,
    message: "",
    aggregations: {},
    modifications: {},
    elements: {},
    elements_volatile: {},
    elements_by_date: {},
    elements_by_date_past: {},
    elements_by_date: {},
    profile: {},
    sources: {},
    version: {},
    sync: {},
};

export default createReducer(initialState, {
    
    [UPDATE_CALENDAR_DATE]: (state, payload) => Object.assign({}, state, {
        calendar_date: payload.calendar_date,
    }),

    [RECEIVE_ELEMENTS_VOLATILE]: (state, payload) => Object.assign({}, state, {
        elements_volatile: (state.elements_volatile == undefined || state.elements_volatile == null || Object.keys(state.elements_volatile).length == 0) ? payload.elements : deepmerge(state.elements_volatile, payload.elements),

        elements_by_type: (state.elements_by_type == undefined || state.elements_by_type == null || Object.keys(state.elements_by_type).length == 0) ? payload.by_type : deepmerge(state.elements_by_type, payload.by_type),

        elements_by_date: (state.elements_by_date == undefined || state.elements_by_date == null || Object.keys(state.elements_by_date).length == 0) ? payload.by_date : deepmerge(state.elements_by_date, payload.by_date),

        elements_by_date_past: (state.elements_by_date_past == undefined || state.elements_by_date_past == null || Object.keys(state.elements_by_date_past).length == 0) ? payload.by_date_past : deepmerge(state.elements_by_date_past, payload.by_date_past),

        message: payload.message,
        isFetching: false,
        loaded: true
    }),
    [RECEIVE_ELEMENTS]: (state, payload) => Object.assign({}, state, {
        elements: (state.elements == undefined || state.elements == null || Object.keys(state.elements).length == 0) ? payload.elements : deepmerge(state.elements, payload.elements),

        elements_by_type: (state.elements_by_type == undefined || state.elements_by_type == null || Object.keys(state.elements_by_type).length == 0) ? payload.by_type : deepmerge(state.elements_by_type, payload.by_type),

        elements_by_date: (state.elements_by_date == undefined || state.elements_by_date == null || Object.keys(state.elements_by_date).length == 0) ? payload.by_date : deepmerge(state.elements_by_date, payload.by_date),

        elements_by_date_past: (state.elements_by_date_past == undefined || state.elements_by_date_past == null || Object.keys(state.elements_by_date_past).length == 0) ? payload.by_date_past : deepmerge(state.elements_by_date_past, payload.by_date_past),

        message: payload.message,
        isFetching: false,
        loaded: true
    }),
    [OVERRIDE_ELEMENTS]: (state, payload) => Object.assign({}, state, {
        elements: payload.elements,
        message: payload.message,
        elements_by_type: payload.by_type,
        elements_by_date: payload.by_date,
        elements_by_date_past: payload.by_date_past,
        isFetching: false,
        loaded: true
    }),



    [UPDATE_TUNED_VALUES]: (state, payload) => Object.assign({}, state, {
        modifications: {...state.modifications, ...payload.modifications}
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

    [OVERRIDE_MESSAGE]: (state, payload) => Object.assign({}, state, {
        message: payload.message
    }),

    [RECEIVE_SETTINGS]: (state, payload) =>
        Object.assign({}, state, {
            sources: payload.sources,
            isFetching: false,
            loaded: true,
            error: false,
    }),



    //PROFILE

    [RECEIVE_PROFILE]: (state, payload) =>
        Object.assign({}, state, {
            profile: payload.profile,
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
            profile: payload.profile,
            statusText: payload.statusText,
            statusType: payload.statusType,
            message_open: true,
    }),

    [UPDATE_PROFILE_REQUEST]: (state) =>
        Object.assign({}, state, {
            isUpdating: true,
    }),



    //VERSION

    [FETCH_VERSION_REQUEST]: (state, payload) =>
        Object.assign({}, state, {
            isFetching: true,
            message_text: payload.message,
    }),

    [RECEIVE_VERSION]: (state, payload) =>
        Object.assign({}, state, {
            version: payload.version,
            isFetching: false,
            loaded: true,
            message_text: payload.message,
    }),


});
