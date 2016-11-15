import { FETCH_PROPOSAL_REQUEST, RECEIVE_PROPOSAL, FETCH_AGGREGATIONS_REQUEST, RECEIVE_AGGREGATIONS } from '../constants/index'
import { data_fetch_api_resource } from '../utils/http_functions'
import { parseJSON } from '../utils/misc'
import { logoutAndRedirect } from './auth'

export function receiveProposal(data) {
    return {
        type: RECEIVE_PROPOSAL,
        payload: {
            data,
        },
    };
}

export function fetchProposalRequest() {
    return {
        type: FETCH_PROPOSAL_REQUEST,
    };
}

export function fetchProposal(token, proposal) {
    return (dispatch) => {
        dispatch(fetchProposalRequest());
        data_fetch_api_resource(token, "proposal/" + proposal)
            .then(parseJSON)
            .then(response => {
                dispatch(receiveProposal(response.result));
            })
            .catch(error => {
                if (error.status === 401) {
                    dispatch(logoutAndRedirect(error));
                }
            });
    };
}

export function fetchAggregationsRequest() {
    return {
        type: FETCH_AGGREGATIONS_REQUEST,
    };
}

export function receiveAggregations(data) {
    return {
        type: RECEIVE_AGGREGATIONS,
        payload: {
            data,
        },
    };
}


export function fetchAggregations(token) {
    return (dispatch) => {
        dispatch(fetchAggregationsRequest());
        data_fetch_api_resource(token, "aggregations/")
            .then(parseJSON)
            .then(response => {
                dispatch(receiveAggregations(response.result));
            })
            .catch(error => {
                if (error.status === 401) {
                    dispatch(logoutAndRedirect(error));
                }
            });
    };
}
