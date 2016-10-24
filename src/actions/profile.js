import { FETCH_PROFILE_REQUEST, RECEIVE_PROFILE } from '../constants/index'
import { data_about_user, data_fetch_api_resource } from '../utils/http_functions'
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

export function fetchProfile(token, userName) {
    return (dispatch) => {
        dispatch(fetchProfileRequest());
        data_fetch_api_resource(token, "user/" + userName)
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
