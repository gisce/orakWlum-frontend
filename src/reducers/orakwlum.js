import { RECEIVE_ELEMENTS, FETCH_ELEMENTS_REQUEST, OVERRIDE_ELEMENTS, OVERRIDE_MESSAGE } from '../constants';
import { createReducer } from '../utils/misc';

const initialState = {
    data: null,
    isFetching: false,
    loaded: false,
    message: "",
};

export default createReducer(initialState, {
    [RECEIVE_ELEMENTS]: (state, payload) =>
        Object.assign({}, state, {
            elements: {...state.elements, ...payload.elements},
            message: payload.message,
            isFetching: false,
            loaded: true,
        }),
    [OVERRIDE_ELEMENTS]: (state, payload) =>
        Object.assign({}, state, {
            elements: payload.elements,
            message: payload.message,
            isFetching: false,
            loaded: true,
        }),
    [FETCH_ELEMENTS_REQUEST]: (state, payload) =>
        Object.assign({}, state, {
            isFetching: true,
            message: payload.message,
        }),


    [OVERRIDE_MESSAGE]: (state, payload) =>
        Object.assign({}, state, {
            message: payload.message,
        }),

});
