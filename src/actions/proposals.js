import { FETCH_PROPOSALS_REQUEST, RECEIVE_PROPOSALS } from '../constants/index';
import { parseJSON } from '../utils/misc';
import { data_about_user, data_fetch_api_resource } from '../utils/http_functions';
import { logoutAndRedirect } from './auth';

export function receiveProtectedData(data) {
    return {
        type: RECEIVE_PROPOSALS,
        payload: {
            data,
        },
    };
}

export function fetchProtectedDataRequest() {
    return {
        type: FETCH_PROPOSALS_REQUEST,
    };
}

export function fetchProtectedData(token) {
    return (dispatch) => {
        dispatch(fetchProtectedDataRequest());
        data_about_user(token)
            .then(parseJSON)
            .then(response => {
                dispatch(receiveProtectedData(response.result));
            })
            .catch(error => {
                if (error.status === 401) {
                    dispatch(logoutAndRedirect(error));
                }
            });
    };
}

export function fetchProtectedDataProposals(token) {
    return (dispatch) => {
        dispatch(fetchProtectedDataRequest());
        data_fetch_api_resource(token, "proposals/")
            .then(parseJSON)
            .then(response => {
                console.log("ENTro");
                console.dir(response.result);
                dispatch(receiveProtectedData(response.result));
            })
            .catch(error => {
                if (error.status === 401) {
                    dispatch(logoutAndRedirect(error));
                }
            });
    };
}
