import { FETCH_SETTINGS_REQUEST, RECEIVE_SETTINGS, UPDATE_SETTINGS_REQUEST, UPDATE_SETTINGS_OK, UPDATE_SETTINGS_KO, RECEIVE_SETTINGS_KO } from '../constants/index'
import { data_fetch_api_resource, data_update_api_resource } from '../utils/http_functions'
import { parseJSON } from '../utils/misc'
import { logoutAndRedirect } from './auth'

export function receiveSettings(data) {
    return {
        type: RECEIVE_SETTINGS,
        payload: {
            data,
        },
    };
}

export function receiveSettingsError(data) {
    return {
        type: RECEIVE_SETTINGS_KO,
        payload: {
            data,
        },
    };
}

export function fetchSettingsRequest() {
    return {
        type: FETCH_SETTINGS_REQUEST,
    };
}


export function receiveUpdateSettings(data) {
    return {
        type: UPDATE_SETTINGS_OK,
        payload: {
            data,
            statusText: "Settings applied correctly",
            statusType: "info",
        },
    };
}

export function receiveUpdateSettingsKO(error) {
    return {
        type: UPDATE_SETTINGS_KO,
        payload: {
            status: (error.status === undefined) ? "403" : error.status,
            statusText: (error.statusText === undefined) ? "The provided credentials are not correct" : error.statusText,
            statusType: "danger",
        },
    };
}


export function updateSettingsRequest() {
    return {
        type: UPDATE_SETTINGS_REQUEST,
    };
}
export function fetchSettings(token) {
    return (dispatch) => {
        dispatch(fetchSettingsRequest());
        data_fetch_api_resource(token, "sources/" )
            .then(parseJSON)
            .then(response => {
                dispatch(receiveSettings(response.result));
            })
            .catch(error => {
                if (error.response.status === 409 || error.status === 409) {
                    throw new Error("Error fetching Settings");
                    dispatch(receiveSettingsError(error.response.data));
                }
                if (error.status === 401) {
                    throw new Error("Error fetching Settings");
                    dispatch(logoutAndRedirect());
                }
            });
    };
}


export function updateSettings(token, data) {
    return (dispatch) => {
        dispatch(updateSettingsRequest());
        data_update_api_resource(token, "sources/", data )
            .then(parseJSON)
            .then(response => {
                if (response.result.was_updated)
                    dispatch(receiveUpdateSettings(response.result));
                else
                    throw new Error("Error updating Settings");
                    dispatch(receiveUpdateSettingsKO({
                        response: {
                            status: 403,
                            statusText: 'Invalid token',
                            statusType: "warning",
                        },
                    }));

            })
            .catch(error => {
                if (error.status === 401) {
                    throw new Error("Error updating Settings");
                    dispatch(logoutAndRedirect(error));
                }
            });
    };
}
