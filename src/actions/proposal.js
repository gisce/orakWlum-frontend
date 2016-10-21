import { FETCH_PROPOSAL_REQUEST, RECEIVE_PROPOSAL } from '../constants/index';
import { parseJSON } from '../utils/misc';
import { data_about_user, data_fetch_api_resource } from '../utils/http_functions';
import { logoutAndRedirect } from './auth';

export function receiveProtectedData(data) {
    return {
        type: RECEIVE_PROPOSAL,
        payload: {
            data,
        },
    };
}

export function fetchProtectedDataRequest() {
    return {
        type: FETCH_PROPOSAL_REQUEST,
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


export function fetchProtectedDataProposal(token, proposal) {
    return (dispatch) => {
        dispatch(fetchProtectedDataRequest());
        data_fetch_api_resource(token, "proposals/" + proposal)
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
