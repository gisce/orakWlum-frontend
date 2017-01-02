import axios from 'axios'

import {
    browserHistory
} from 'react-router'

import {
    VERSION_PR,
    FETCH_PR_REQUEST,
    RECEIVE_PR,
} from '../constants/index'


import {
    data_fetch_api_resource,
    data_create_api_resource,
    data_delete_api_resource
} from '../utils/http_functions'

import {
    parseJSON
} from '../utils/misc'


export function fetchPRrequest(initial) {
    const message = (initial)?null:"Fetching PR";
    return {
        type: FETCH_PR_REQUEST,
        payload: {
            message,
        },
    };
}

export function fetchPR(token, PR=VERSION_PR, initial=false) {
    return (dispatch) => {
        dispatch(fetchPRrequest(initial));
        data_fetch_api_resource(token, "version/" + PR)
            .then(parseJSON)
            .then(response => {
                dispatch(receivePR(response.result, response.aggregations, initial));
            })
            .catch(error => {
                if (error.status === 401) {
                    dispatch(logoutAndRedirect(error));
                }
            });
    };
}

export function receivePR(data, aggregations, initial) {
    const message = (initial)?null:"Refreshing PR";
    return {
        type: RECEIVE_PR,
        payload: {
            data,
            aggregations,
            message,
        },
    };
}
