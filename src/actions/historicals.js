import {
    FETCH_HISTORICALS_REQUEST,
    RECEIVE_HISTORICALS
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


export function fetchHistoricalsRequest(initial) {
    const message = (initial)?null:"Refreshing historicals list";

    return {
        type: FETCH_HISTORICALS_REQUEST,
        payload: {
            message,
        },
    };
}

export function receiveHistoricals(data, aggregations, initial) {
    const message = (initial)?null:"Historicals list updated";
    return {
        type: RECEIVE_HISTORICALS,
        payload: {
            data,
            aggregations,
            message,
        },
    };
}

export function fetchHistoricals(token, initial=false) {
    return (dispatch) => {
        dispatch(fetchHistoricalsRequest(initial));
        data_fetch_api_resource(token, "historical/")
            .then(parseJSON)
            .then(response => {
                dispatch(receiveHistoricals(response.result, response.aggregations, initial));
            })
            .catch(error => {
                if (error.status === 401) {
                    dispatch(logoutAndRedirect(error));
                }
            });
    };
}
