import { NEW_NOTIFICATION, NOTIFICATION_DONE } from '../constants/index';
import { logoutAndRedirect } from './auth';

export function newNotification(message, time) {
    return {
        type: NEW_NOTIFICATION,
        payload: {
                message: message,
                open: true,
                show_time: time,
        },
    };
}

export function closeNotification() {
    return {
        type: NOTIFICATION_DONE,
        payload: {
                message: null,
                open: false,
        },
    };
}
export function setNotification(message, time) {
    return (dispatch) => {
        dispatch(newNotification());
        dispatch(setNotification(message, time));
    };
}
