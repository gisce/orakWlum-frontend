import { NEW_NOTIFICATION, NOTIFICATION_DONE } from '../constants/index';

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
export function setNotification(message, time=5) {
    console.log("setting Notification");
    return (dispatch) => {
        dispatch(newNotification(message, time));
    };
}
