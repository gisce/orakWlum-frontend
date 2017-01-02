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


export function fetchProposalsRequest(initial) {
    const message = (initial)?null:"Refreshing proposals list";

    return {
        type: FETCH_PROPOSALS_REQUEST,
        payload: {
            message,
        },
    };
}

export function receiveProposals(data, aggregations, initial) {
    const message = (initial)?null:"Proposals list updated";
    return {
        type: RECEIVE_PROPOSALS,
        payload: {
            data,
            aggregations,
            message,
        },
    };
}

export function fetchProposals(token, initial=false) {
    return (dispatch) => {
        dispatch(fetchProposalsRequest(initial));
        data_fetch_api_resource(token, "proposal/")
            .then(parseJSON)
            .then(response => {
                dispatch(receiveProposals(response.result, response.aggregations, initial));
            })
            .catch(error => {
                if (error.status === 401) {
                    dispatch(logoutAndRedirect(error));
                }
            });
    };
}
