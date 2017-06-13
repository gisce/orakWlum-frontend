import {
    FETCH_ELEMENTS_REQUEST,
    RECEIVE_ELEMENTS,
    OVERRIDE_ELEMENTS,
    OVERRIDE_MESSAGE,
    OVERRIDE_AGGREGATIONS
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

    //If the return is OK
    if (the_code == 200) {
        const the_elements = JSON.parse(response.result);
        const the_message = response.message;

        return {
            type: reducer_type,
            payload: {
                elements: the_elements,
                message: the_message,
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

export function overrideMessage(response, initial) {
    const message = (initial)?null:"Message updated";

    //Set the code, or 404
    const the_code = (response.code? response.code : 404);

    console.log(the_code);

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

export function fetchElements(a_filter=null, initial=false) {
    return (dispatch) => {
        dispatch(saveElements(initial));
        ask_the_api("elements.get", a_filter);
    };
}

export function fetchElement(filter=null, initial=false) {
    return (dispatch) => {
        dispatch(extendElements(initial));
        ask_the_api("element.get", a_filter);
    };
}
