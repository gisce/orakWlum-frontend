import { FETCH_PROFILE_REQUEST, RECEIVE_PROFILE, UPDATE_PROFILE_REQUEST, UPDATE_PROFILE_OK, UPDATE_PROFILE_KO, RECEIVE_PROFILE_KO, CHANGE_PASSWORD_REQUEST, CHANGE_PASSWORD_OK, CHANGE_PASSWORD_KO } from '../constants/index'
import { data_fetch_api_resource, data_update_api_resource } from '../utils/http_functions'
import { parseJSON } from '../utils/misc'
import { logoutAndRedirect } from './auth'

export function receiveProfile(data) {
    return {
        type: RECEIVE_PROFILE,
        payload: {
            data,
        },
    };
}

export function receiveProfileError(data) {
    return {
        type: RECEIVE_PROFILE_KO,
        payload: {
            data,
        },
    };
}

export function fetchProfileRequest() {
    return {
        type: FETCH_PROFILE_REQUEST,
    };
}


export function receiveUpdateProfile(data) {
    return {
        type: UPDATE_PROFILE_OK,
        payload: {
            data,
            statusText: "Changes applied correctly",
            statusType: "info",
        },
    };
}

export function receiveUpdateProfileKO(error) {
    return {
        type: UPDATE_PROFILE_KO,
        payload: {
            status: (error.status === undefined) ? "403" : error.status,
            statusText: (error.statusText === undefined) ? "The provided credentials are not correct" : error.statusText,
            statusType: "danger",
        },
    };
}


export function updateProfileRequest() {
    return {
        type: UPDATE_PROFILE_REQUEST,
    };
}
export function fetchProfile(token) {
    return (dispatch) => {
        dispatch(fetchProfileRequest());
        data_fetch_api_resource(token, "user/" )
            .then(parseJSON)
            .then(response => {
                dispatch(receiveProfile(response.result));
            })
            .catch(error => {
                if (error.response.status === 409 || error.status === 409) {
                    dispatch(receiveProfileError(error.response.data));
                }
                if (error.status === 401) {
                    dispatch(logoutAndRedirect());
                }
            });
    };
}


export function updateProfile(token, data) {
    return (dispatch) => {
        dispatch(updateProfileRequest());
        data_update_api_resource(token, "user/", data )
            .then(parseJSON)
            .then(response => {
                if (response.result.was_updated)
                    dispatch(receiveUpdateProfile(response.result));
                else
                    dispatch(receiveUpdateProfileKO({
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






export function changePasswordRequest() {
    return {
        type: CHANGE_PASSWORD_REQUEST,
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
