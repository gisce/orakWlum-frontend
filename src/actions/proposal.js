import { FETCH_PROPOSAL_REQUEST, RUN_PROPOSAL_REQUEST, RECEIVE_PROPOSAL, RECEIVE_RUN_PROPOSAL, FETCH_AGGREGATIONS_REQUEST, RECEIVE_AGGREGATIONS, DUPLICATE_PROPOSAL_REQUEST } from '../constants/index'
import { data_fetch_api_resource } from '../utils/http_functions'
import { parseJSON } from '../utils/misc'
import { logoutAndRedirect, redirectToRoute } from './auth'


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
                dispatch(receiveProposal(response.result, response.aggregations));
            })
            .catch(error => {
                if (error.status === 401) {
                    dispatch(logoutAndRedirect(error));
                }
            });
    };
}

export function receiveProposal(data, aggregations) {
    return {
        type: RECEIVE_PROPOSAL,
        payload: {
            data,
            aggregations,
        },
    };
}






export function runProposalRequest() {
    return {
        type: RUN_PROPOSAL_REQUEST,
    };
}

export function runProposal(token, proposal) {
    return (dispatch) => {
        dispatch(runProposalRequest());
        data_fetch_api_resource(token, "proposal/" + proposal + "/run/")
            .then(parseJSON)
            .then(response => {
                dispatch(receiveRunProposal(response.result, response.aggregations));
            })
            .catch(error => {
                if (error.status === 401) {
                    dispatch(logoutAndRedirect(error));
                }
            });
    };
}

export function receiveRunProposal(data, aggregations) {

    const message = "Updating proposal with the result of the last execution";

    return {
        type: RECEIVE_RUN_PROPOSAL,
        payload: {
            data,
            aggregations,
            message,
        },
    };
}







export function duplicateProposalRequest() {
    return {
        type: DUPLICATE_PROPOSAL_REQUEST,
    };
}

export function duplicateProposal(token, proposal) {
    return (dispatch) => {
        dispatch(duplicateProposalRequest());
        data_fetch_api_resource(token, "proposal/" + proposal + "/duplicate/")
            .then(parseJSON)
            .then(response => {
                if (response.result.status == "ok") {
                    dispatch(fetchProposal(token, response.result.id));
                    dispatch(redirectToRoute("/proposals/"+response.result.id));
                }
                else {
                    console.log("error duplicating proposal " + proposal);
                }
            })
            .catch(error => {
                if (error.status === 401) {
                    dispatch(logoutAndRedirect(error));
                }
            });
    };
}

export function receiveDuplicateProposal(token, proposal) {
    dispatch(fetchProposal(token, proposal));
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
