import { FETCH_PROPOSAL0_REQUEST, RECEIVE_PROPOSAL0 } from '../constants/index'
import { data_fetch_api_resource } from '../utils/http_functions'
import { parseJSON } from '../utils/misc'
import { logoutAndRedirect } from './auth'

export function receiveProposal(data) {
    return {
        type: RECEIVE_PROPOSAL0,
        payload: {
            data,
        },
    };
}

export function fetchProposalRequest() {
    return {
        type: FETCH_PROPOSAL0_REQUEST,
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
