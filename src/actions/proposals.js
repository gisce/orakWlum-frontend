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

export function receiveProtectedData(data, aggregations) {
    return {
        type: RECEIVE_PROPOSALS,
        payload: {
            data,
            aggregations,
        },
    };
}

export function fetchProtectedDataRequest(initial) {
    const message = (initial)?null:"Refreshing proposals list";

    return {
        type: FETCH_PROPOSALS_REQUEST,
        payload: {
            message,
        },
    };
}

export function fetchProtectedDataProposals(token, initial=false) {
    return (dispatch) => {
        dispatch(fetchProtectedDataRequest(initial));
        data_fetch_api_resource(token, "proposal/")
            .then(parseJSON)
            .then(response => {
                dispatch(receiveProtectedData(response.result, response.aggregations));
            })
            .catch(error => {
                if (error.status === 401) {
                    dispatch(logoutAndRedirect(error));
                }
            });
    };
}
