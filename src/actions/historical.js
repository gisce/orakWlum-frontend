import { EXPORT_HISTORICAL_REQUEST, FETCH_HISTORICAL_REQUEST, RUN_HISTORICAL_REQUEST, RECEIVE_HISTORICAL, RECEIVE_RUN_HISTORICAL, RECEIVE_RUN_HISTORICAL_ERROR, FETCH_AGGREGATIONS_REQUEST, RECEIVE_AGGREGATIONS, DUPLICATE_HISTORICAL_REQUEST, DELETE_HISTORICAL_REQUEST, CREATE_HISTORICAL_REQUEST } from '../constants/index'
import { data_download_api_resource, data_fetch_api_resource, data_create_api_resource, data_delete_api_resource } from '../utils/http_functions'
import { parseJSON } from '../utils/misc'
import { logoutAndRedirect, redirectToRoute } from './auth'
import { fetchHistoricals } from './historicals'




/*******************
  ################
   FETCH HISTORICAL
  ################
*******************/

export function fetchHistoricalRequest(initial) {
    const message = (initial)?null:"Fetching historical";
    return {
        type: FETCH_HISTORICAL_REQUEST,
        payload: {
            message,
        },
    };
}

export function fetchHistorical(token, historical, initial=false) {
    return (dispatch) => {
        dispatch(fetchHistoricalRequest(initial));
        data_fetch_api_resource(token, "historical/" + historical)
            .then(parseJSON)
            .then(response => {
                dispatch(receiveHistorical(response.result, response.aggregations, initial));
            })
            .catch(error => {
                if (error.status === 401) {
                    dispatch(logoutAndRedirect(error));
                }
            });
    };
}

export function receiveHistorical(data, aggregations, initial) {
    const message = (initial)?null:"Refreshing historical";
    return {
        type: RECEIVE_HISTORICAL,
        payload: {
            data,
            aggregations,
            message,
        },
    };
}




/******************
  ##############
   RUN HISTORICAL
  ##############
+*****************/

export function runHistoricalRequest() {
    const message = "(re)Processing historical";

    return {
        type: RUN_HISTORICAL_REQUEST,
        payload: {
            message,
        },
    };
}

export function runHistorical(token, historical) {
    const errorType = "Processing error";

    return (dispatch) => {
        dispatch(runHistoricalRequest());
        data_fetch_api_resource(token, "historical/" + historical + "/run/")
            .then(parseJSON)
            .then(response => {
                dispatch(receiveRunHistorical(response.result, response.aggregations));
            })
            .catch(error => {
                const data = error.response.data;

                switch (error.response.status) {
                    case 406:
                        console.log(errorType);
                        if (data.error)
                            dispatch(receiveRunHistoricalError(errorType, data.message));
                    break;

                    case 403:
                        console.log("err");
                    break;

                    case 401:
                        dispatch(logoutAndRedirect(error));
                    break;

                    default:
                        console.log("generic error " + error);
                }
            });
    };
}

export function receiveRunHistorical(data, aggregations) {
    const message = "Updating historical with the result of the last execution";

    return {
        type: RECEIVE_RUN_HISTORICAL,
        payload: {
            data,
            aggregations,
            message,
        },
    };
}

export function receiveRunHistoricalError(error, errorMessage) {
    const message = error + ": " + errorMessage;

    return {
        type: RECEIVE_RUN_HISTORICAL_ERROR,
        payload: {
            message,
        },
    };
}




/************************
  ####################
   DUPLICATE HISTORICAL
  ####################
+***********************/

export function duplicateHistoricalRequest() {
    return {
        type: DUPLICATE_HISTORICAL_REQUEST,
    };
}

export function duplicateHistorical(token, historical) {
    return (dispatch) => {
        dispatch(duplicateHistoricalRequest());
        data_fetch_api_resource(token, "historical/" + historical + "/duplicate/")
            .then(parseJSON)
            .then(response => {
                if (response.result.status == "ok") {
                    dispatch(redirectToRoute("/historicals/"+response.result.id));
                    dispatch(fetchHistorical(token, response.result.id));
                }
                else {
                    console.log("error duplicating historical " + historical);
                }
            })
            .catch(error => {
                if (error.status === 401) {
                    dispatch(logoutAndRedirect(error));
                }
            });
    };
}




/*********************
  #################
   CREATE HISTORICAL
  #################
+********************/

export function createHistoricalRequest() {
    return {
        type: CREATE_HISTORICAL_REQUEST,
    };
}

export function createHistorical(token, historical) {
    return (dispatch) => {
        dispatch(createHistoricalRequest());
        data_create_api_resource(token, "historical/", historical)
            .then(parseJSON)
            .then(response => {
                if (response.result.status == "ok") {

                    if (response.result.multi)
                        dispatch(redirectToRoute("/historicals"))
                    else {
                            dispatch(fetchHistorical(token, response.result.id));
                            dispatch(redirectToRoute("/historicals/"+response.result.id));
                    }
                }
                else {
                    console.log("error creating historical " + historical);
                }
            })
            .catch(error => {
                if (error.status === 401) {
                    dispatch(logoutAndRedirect(error));
                }
            });
    };
}



/*********************
  #################
   DELETE HISTORICAL
  #################
*********************/

export function deleteHistoricalRequest() {
    return {
        type: DELETE_HISTORICAL_REQUEST,
    };
}

export function deleteHistorical(token, historical) {
    return (dispatch) => {
        dispatch(deleteHistoricalRequest());
        data_delete_api_resource(token, "historical/" + historical + "/")
            .then(parseJSON)
            .then(response => {
                if (response.result.status == "ok") {
                    dispatch(redirectToRoute("/historicals"));
                }
                else {
                    console.log("ERROR:" + response.result.message);
                }
            })
            .catch(error => {
                if (error.status === 401) {
                    dispatch(logoutAndRedirect(error));
                }
            });
    };
}




/**********************
  ###################
   FETCH AGGREGATION
  ###################
+**********************/

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





/*********************
  #################
   EXPORT HISTORICAL
  #################
*********************/


var FileSaver = require('../../node_modules/file-saver/FileSaver.min.js');

export function exportHistoricalRequest() {
    return {
        type: EXPORT_HISTORICAL_REQUEST,
    };
}

export function exportHistorical(token, historical) {
    return (dispatch) => {
        dispatch(exportHistoricalRequest());
        data_download_api_resource(token, "historical/" + historical + "/xls/")
            .then(response => {
               const filename = response.headers["content-disposition"].split("=");
               FileSaver.saveAs(response.data, filename[1]);
            })
            .catch(error => {
                if (error.status === 401) {
                    dispatch(logoutAndRedirect(error));
                }
            });
    };
}
