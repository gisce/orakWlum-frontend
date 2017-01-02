import axios from 'axios'

import {
    browserHistory
} from 'react-router'

import {
    VERSION_PR,
    FETCH_VERSION_REQUEST,
    RECEIVE_VERSION,
    RECEIVE_VERSION_ERROR,
} from '../constants/index'


import {
    data_fetch_api_resource,
    data_create_api_resource,
    data_delete_api_resource
} from '../utils/http_functions'

import {
    parseJSON
} from '../utils/misc'


export function fetchVersionRequest(initial) {
    const message = (initial)?null:"Fetching current version detail";
    return {
        type: FETCH_VERSION_REQUEST,
        payload: {
            message,
        },
    };
}

export function fetchVersion(token, PR=VERSION_PR, initial=false) {
    return (dispatch) => {
        dispatch(fetchVersionRequest(initial));
        data_fetch_api_resource(token, "version/" + PR)
            .then(parseJSON)
            .then(response => {
                dispatch(receiveVersion(response.data, initial));
            })
            .catch(error => {
                if (error.status === 401) {
                    dispatch(logoutAndRedirect(error));
                }
                else {
                    dispatch(receiveVersionError(error.response.status));
                }
            });
    };
}

export function receiveVersion(data, initial) {
    const message = (initial)?null:"Refreshing current version detail";
    return {
        type: RECEIVE_VERSION,
        payload: {
            data,
            message,
        },
    };
}

export function receiveVersionError(error) {
    const message = "Error while loading current version detail (" + error + ")";
    return {
        type: RECEIVE_VERSION_ERROR,
        payload: {
            message,
        },
    };
}
