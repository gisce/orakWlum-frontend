import {
    FETCH_PROPOSALS_REQUEST,
    RECEIVE_PROPOSALS
} from '../constants/index'
import {
    data_fetch_api_resource
} from '../utils/http_functions'
import {
    parseJSON
} from '../utils/misc'
import {
    logoutAndRedirect
} from './auth'

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

export function fetchProtectedDataProposals(token) {
    return (dispatch) => {
        dispatch(fetchProtectedDataRequest());
        data_fetch_api_resource(token, "proposal/")
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
