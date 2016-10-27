import { FETCH_PROFILE_REQUEST, RECEIVE_PROFILE, UPDATE_PROFILE_REQUEST, RECEIVE_UPDATE_PROFILE } from '../constants/index'
import { data_fetch_api_resource } from '../utils/http_functions'
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

export function fetchProfileRequest() {
    return {
        type: FETCH_PROFILE_REQUEST,
    };
}


export function receiveUpdateProfile(data) {
    return {
        type: RECEIVE_UPDATE_PROFILE,
        payload: {
            data,
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
                if (error.status === 401) {
                    dispatch(logoutAndRedirect(error));
                }
            });
    };
}


export function updateProfile(token) {
    return (dispatch) => {
        dispatch(updateProfileRequest());
        data_fetch_api_resource(token, "user/" )
            .then(parseJSON)
            .then(response => {
                dispatch(receiveProfile(response.result));
            })
            .catch(error => {
                if (error.status === 401) {
                    dispatch(logoutAndRedirect(error));
                }
            });
    };
}
