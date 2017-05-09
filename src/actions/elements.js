import {
    FETCH_ELEMENTS_REQUEST,
    RECEIVE_ELEMENTS
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


export function fetchElementsRequest(initial) {
    const message = (initial)?null:"Refreshing elements list";

    return {
        type: FETCH_ELEMENTS_REQUEST,
        payload: {
            message,
        },
    };
}

export function receiveElements(data, aggregations, initial) {
    const message = (initial)?null:"Elements list updated";
    return {
        type: RECEIVE_ELEMENTS,
        payload: {
            data,
            aggregations,
            message,
        },
    };
}

export function fetchElements(token, elements, initial=false) {
    return (dispatch) => {
        dispatch(fetchElementsRequest(initial));

        data_fetch_api_resource(token, "elements/" + elements)
            .then(parseJSON)
            .then(response => {
                dispatch(receiveElements(response.result, response.aggregations, initial));
            })
            .catch(error => {
                if (error.status === 401) {
                    dispatch(logoutAndRedirect(error));
                }
            });
    };
}
