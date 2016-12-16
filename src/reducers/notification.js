import { NEW_NOTIFICATION, NOTIFICATION_DONE } from '../constants/index';
import { createReducer } from '../utils/misc';

const initialState = {
    message: null,
    open: false,
    show_time: 5,
};

export default createReducer(initialState, {
    [NEW_NOTIFICATION]: (state, payload) =>
        Object.assign({}, state, {
            message: payload.message,
            show_time: payload.show_time,
            open: payload.open,
        }),
    [NOTIFICATION_DONE]: (state, payload) =>
        Object.assign({}, state, {
            message: payload.message,
            open: payload.open,
        }),
});
