import {
    FETCH_ELEMENTS_REQUEST,
    RECEIVE_ELEMENTS,
    OVERRIDE_ELEMENTS,
    OVERRIDE_MESSAGE,
    OVERRIDE_AGGREGATIONS,
    FETCH_AGGREGATIONS_REQUEST,
    RUN_ELEMENT_REQUEST,
    RECEIVE_ELEMENTS_VOLATILE,
} from '../constants/index'

import {
    socket,
    ask_the_api
} from '../utils/http_functions'

import {
    parseJSON
} from '../utils/misc'

import {
    logoutAndRedirect
} from './auth'


export function fetchAggregationsRequest(initial) {
    const message = (initial)?null:"Refreshing aggregations list";

    return {
        type: FETCH_AGGREGATIONS_REQUEST,
        payload: {
            message,
        },
    };
}

export function fetchElementsRequest(initial) {
    const message = (initial)?null:"Refreshing elements list";

    return {
        type: FETCH_ELEMENTS_REQUEST,
        payload: {
            message,
        },
    };
}

//Handle how to reduce elements
export function reduceElements(reducer_type, response, initial) {
    const message = (initial)?null:"Elements list updated";

    //Set the code, or 404
    const the_code = (response.code? response.code : 404);


    let by_date = {}
    let by_date_future = {}
    let by_type = {}

    //If the return is OK
    if (the_code == 200) {
        const the_elements = JSON.parse(response.result);

        for ( let [key, value] of Object.entries(the_elements)) {

            // Add current ID in by_type[type] object
            if ('element_type' in value && value.element_type) {
                if (!(value.element_type in by_type))
                    by_type[value.element_type] = {};

                by_type[value.element_type] = {
                    ...by_type[value.element_type],
                    [key]: value,
                }
            }

            // Add current ID in by_date[type] object
            if ('days_list' in value && Object(value.days_list).length > 0) {
                if (!(value.days_list[0] in by_date))
                    by_date[value.days_list[0]] = {};

                by_date[value.days_list[0]] = {
                    ...by_type[value.days_list[0]],
                    [key]: value,
                }
            }
        }

        const the_message = response.message;

        return {
            type: reducer_type,
            payload: {
                elements: the_elements,
                message: the_message,
                by_type,
                by_date,
            },
        };
    }
    return {};
}

//Override all elements
export function overrideElements(response, initial) {
    return reduceElements(OVERRIDE_ELEMENTS, response, initial);
}

//Extend (merge) fetched elements
export function extendElements (response, initial) {
    return reduceElements(RECEIVE_ELEMENTS, response, initial);
}

//Extend (merge) fetched VOLATILE elements
export function extendElementsVolatile (response, initial) {
    return reduceElements(RECEIVE_ELEMENTS_VOLATILE, response, initial);
}

export function overrideMessage(response, initial) {
    const message = (initial)?null:"Message updated";

    //Set the code, or 404
    const the_code = (response.code? response.code : 404);

    //If the return is OK
    if (the_code == 200) {
        const the_message = response.message;

        return {
            type: OVERRIDE_MESSAGE,
            payload: {
                message: the_message,
            },
        };
    }
}






//Handle how to reduce aggregations
export function overrideAggregations(response, initial) {
    const message = (initial)?null:"Aggregations list updated";

    //Set the code, or 404
    const the_code = (response.code? response.code : 404);

    //If the return is OK
    if (the_code == 200) {
        const the_aggregations = JSON.parse(response.result);
        const the_message = response.message;

        return {
            type: OVERRIDE_AGGREGATIONS,
            payload: {
                aggregations: the_aggregations,
                message: the_message,
            },
        };
    }
    return {};
}



/**************
 The Fetchers!
**************/

export function fetchConcatenate(ids_list, initial=false) {
    return (dispatch) => {
        dispatch(fetchElementsRequest(initial));
        ask_the_api("elements.concatenate", ids_list);
    };
}

export function fetchComparation(ids_list, initial=false) {
    return (dispatch) => {
        dispatch(fetchElementsRequest(initial));
        ask_the_api("elements.compare", ids_list);
    };
}

export function fetchElements(a_filter=null, initial=false, override=false) {
    const response = (override)? "elements.override" : "elements.extend";
    return (dispatch) => {
        dispatch(fetchElementsRequest(initial));
        ask_the_api("elements.get", a_filter, initial, response);
    };
}

export function refreshElements(a_filter=null, silent=false, override=false) {
    const response = (override)? "elements.override" : "elements.extend";
    return (dispatch) => {
        dispatch(fetchElementsRequest(silent));
        ask_the_api("elements.refresh", a_filter, silent, response);
    };
}

export function fetchElement(filter=null, initial=false) {
    return (dispatch) => {
        dispatch(fetchElementsRequest(initial));
        ask_the_api("element.get", a_filter);
    };
}

export function fetchAggregations(a_filter=null, initial=false) {
    return (dispatch) => {
        dispatch(fetchAggregationsRequest(initial));
        ask_the_api("aggregations.get", a_filter);
    };
}



/**************
The Updaters !
**************/

export function runElementRequest() {
    const message = "(re)Processing proposal";

    return {
        type: RUN_ELEMENT_REQUEST,
        payload: {
            message,
        },
    };
}

export function runElement(a_filter=null) {
    return (dispatch) => {
        dispatch(runElementRequest());
        ask_the_api("elements.run", a_filter);
    };
}
