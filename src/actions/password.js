import { CHANGE_PASSWORD_REQUEST, CHANGE_PASSWORD_OK, CHANGE_PASSWORD_KO, CHANGE_PASSWORD_INI } from '../constants/index'
import { data_update_api_resource } from '../utils/http_functions'
import { parseJSON } from '../utils/misc'
import { logoutAndRedirect } from './auth'

export function startChangePasswordFlow() {
    return {
        type: CHANGE_PASSWORD_INI,
    };
}


export function changePasswordRequest() {
    return {
        type: CHANGE_PASSWORD_REQUEST,
        payload: {
            statusText: "Trying to change password...",
            statusType: "info",
        },
    };
}

export function receiveChangePassword(data) {
    return {
        type: CHANGE_PASSWORD_OK,
        payload: {
            data,
            statusText: "Password changed",
            statusType: "info",
        },
    };
}

export function receiveChangePasswordKO(error) {
    return {
        type: CHANGE_PASSWORD_KO,
        payload: {
            status: (error.status === undefined) ? "403" : error.status,
            statusText: (error.statusText === undefined) ? "The provided credentials are not correct" : error.statusText,
            statusType: "danger",
        },
    };
}

export function changePassword(token, currentPassword, newPassword) {
    return (dispatch) => {
        dispatch(changePasswordRequest());
        data_update_api_resource(token, "user/password", {password: newPassword, current: currentPassword} )
            .then(parseJSON)
            .then(response => {
                if (response.result.was_updated)
                    dispatch(receiveChangePassword(response.result));
                else
                    dispatch(receiveChangePasswordKO({
                        response: {
                            status: 403,
                            statusText: 'Invalid token',
                            statusType: "warning",
                        },
                    }));

            })
            .catch(error => {
                if (error.status === 401) {
                    dispatch(logoutAndRedirect(error));
                }
            });
    };
}
