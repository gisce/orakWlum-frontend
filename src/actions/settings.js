import { FETCH_SETTINGS_REQUEST, RECEIVE_SETTINGS, UPDATE_SETTINGS_REQUEST, UPDATE_SETTINGS_OK, UPDATE_SETTINGS_KO, RECEIVE_SETTINGS_KO } from '../constants/index'
import { data_fetch_api_resource, data_update_api_resource, ask_the_api } from '../utils/http_functions'
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
export function fetchSettings(a_filter=null, silent=false, override=false) {
    return (dispatch) => {
        dispatch(fetchSettingsRequest());
        ask_the_api("sources.get", a_filter, silent);
    };
}


export function updateSettings(token, data) {
    return (dispatch) => {
        dispatch(updateSettingsRequest());
        data_update_api_resource(token, "sources/", data )
            .then(parseJSON)
            .then(response => {
                if (response.result.was_updated) {
                    dispatch(receiveUpdateSettings(response.result));
                }
                else {
                    throw new Error("Error updating Settings");
                    dispatch(receiveUpdateSettingsKO({
                        response: {
                            status: 403,
                            statusText: 'Invalid token',
                            statusType: "warning",
                        },
                    }));
                }

            })
            .catch(error => {
                if (error.status === 401) {
                    dispatch(logoutAndRedirect(error));
                }
            });
    };
}

export function toggleSourceSettings(token, data) {
    return (dispatch) => {
        dispatch(updateSettingsRequest());
        data_update_api_resource(token, "sources/status/toggle", data )
            .then(parseJSON)
            .then(response => {
                if (response.result.was_updated == true)
                    dispatch(receiveUpdateSettings(response.result));
                else {
                    throw new Error("Error toggling Settings");
                    dispatch(receiveUpdateSettingsKO({
                        response: {
                            status: 403,
                            statusText: 'Invalid token',
                            statusType: "warning",
                        },
                    }));
                }

            })
            .catch(error => {
                if (error.status === 401) {
                    dispatch(logoutAndRedirect(error));
                }
            });
    };
}
