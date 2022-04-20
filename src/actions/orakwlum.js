import {
    FETCH_ELEMENTS_REQUEST,
    RECEIVE_ELEMENTS,
    OVERRIDE_ELEMENTS,
    OVERRIDE_MESSAGE,
    OVERRIDE_AGGREGATIONS,
    FETCH_AGGREGATIONS_REQUEST,
    RUN_ELEMENT_REQUEST,
    RECEIVE_ELEMENTS_VOLATILE,
    FETCH_EXPORT_ELEMENTS_REQUEST,
    FETCH_COMPARATION_ELEMENTS_REQUEST,

    DUPLICATE_PROPOSAL_REQUEST,
    CREATE_PROPOSAL_REQUEST,
    CREATE_PROPOSAL_DONE,
    UPDATE_PROPOSAL_REQUEST,

    FETCH_SETTINGS_REQUEST,
    RECEIVE_SETTINGS,
    UPDATE_SETTINGS_REQUEST,
    DELETE_PROPOSAL_REQUEST,
    BUY_PROPOSAL_REQUEST,

    FETCH_PROFILE_REQUEST,
    RECEIVE_PROFILE,
    UPDATE_PROFILE_REQUEST,
    UPDATE_PROFILE_OK,
    UPDATE_PROFILE_KO,
    RECEIVE_PROFILE_KO,

    UPDATE_TUNED_VALUES,

    API_ERROR,

    VERSION_PR,
    FETCH_VERSION_REQUEST,
    RECEIVE_VERSION,
    RECEIVE_VERSION_ERROR,

    UPDATE_CALENDAR_DATE,

} from '../constants/index'

import {
    ask_the_api,
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

export function fetchElementsExportRequest(initial) {
    const message = (initial)?null:"Exporting elements";

    return {
        type: FETCH_EXPORT_ELEMENTS_REQUEST,
        payload: {
            message,
        },
    };
}

export function fetchElementsComparationRequest(initial) {
    const message = (initial)?null:"Comparing elements";

    return {
        type: FETCH_COMPARATION_ELEMENTS_REQUEST,
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
    let by_date_past = {}
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

            // Add current ID in by_date_past[type] object
            if ('days_range_past' in value && Object(value.days_range_past).length > 0) {
                if (!(value.days_range_past[0] in by_date_past))
                    by_date_past[value.days_range_past[0]] = {};

                by_date_past[value.days_range_past[0]] = {
                    ...by_type[value.days_range_past[0]],
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
                by_date_past,
            },
        };
    }

    return {
        type: API_ERROR,
        payload: {
            expected: reducer_type,
            response: response,
        },
    };
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

    return {
        type: API_ERROR,
        payload: {
            expected: OVERRIDE_MESSAGE,
            response: response,
        },
    };

}

export function update_calendar_date(newDate) {
    console.log("SETTING DATE", newDate)
    return {
        type: UPDATE_CALENDAR_DATE,
        payload: {
            calendar_date: newDate,
        },
    };
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

    return {
        type: API_ERROR,
        payload: {
            expected: OVERRIDE_AGGREGATIONS,
            response: response,
        },
    };
}


/**********
  SOURCES
**********/


export function fetchSettingsRequest() {
    return {
        type: FETCH_SETTINGS_REQUEST,
    };
}

export function fetchSettings(a_filter=null, silent=false, override=false) {
    return (dispatch) => {
        dispatch(fetchSettingsRequest());
        ask_the_api("sources.get", a_filter, silent);
    };
}

//Reduce Sources
export function overrideSources(response, initial) {
    const message = (initial)?null:"Sources updated";

    //Set the code, or 404
    const the_code = (response.code? response.code : 404);

    //If the return is OK
    if (the_code == 200) {
        const the_result = JSON.parse(response.result);
        const the_message = response.message;

        return {
            type: RECEIVE_SETTINGS,
            payload: {
                sources: the_result,
                message: the_message,
            },
        };
    }

    return {
        type: API_ERROR,
        payload: {
            expected: RECEIVE_SETTINGS,
            response: response,
        },
    };
}

export function updateSettingsRequest() {
    return {
        type: UPDATE_SETTINGS_REQUEST,
    };
}

export function updateSettings(data, silent=false) {
    return (dispatch) => {
        dispatch(updateSettingsRequest());
        ask_the_api("sources.update", data, silent )
    };
}

export function toggleSourceSettings(data, silent=false) {
    return (dispatch) => {
        dispatch(updateSettingsRequest());
        ask_the_api("sources.status.toggle", data, silent )
    };
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
        dispatch(fetchElementsComparationRequest(initial));
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

export function fetchElementsDetail(a_filter=null, initial=false, override=false) {
    const response = (override)? "elements.override" : "elements.extend";
    return (dispatch) => {
        dispatch(fetchElementsRequest(initial));
        ask_the_api("elements.get.detail", a_filter, initial, response);
    };
}

export function refreshElements(a_filter=null, silent=false, override=false) {
    const response = (override)? "elements.override" : "elements.extend";
    return (dispatch) => {
        dispatch(fetchElementsRequest(silent));
        ask_the_api("elements.refresh", a_filter, silent, response);
    };
}

export function fetchElement(a_filter=null, initial=false) {
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

export function exportElement(a_filter=null, initial=false) {
    return (dispatch) => {
        dispatch(fetchElementsExportRequest(initial));
        ask_the_api("elements.export", a_filter, window.socket.id);
    };
}


export function exportElementDetail(a_filter=null, initial=false) {
    return (dispatch) => {
        dispatch(fetchElementsExportRequest(initial));
        ask_the_api("elements.export_detail", a_filter, window.socket.id);
    };
}

export function exportElementPricelistDetail(a_filter=null, initial=false) {
    return (dispatch) => {
        dispatch(fetchElementsExportRequest(initial));
        ask_the_api("elements.export_pricelist_detail", a_filter, window.socket.id);
    };
}

export function duplicateElementRequest() {
    return {
        type: DUPLICATE_PROPOSAL_REQUEST,
    };
}

export function duplicateElement(element, initial) {
    return (dispatch) => {
        dispatch(duplicateElementRequest());
        ask_the_api("elements.duplicate", element, initial);
        setTimeout(() => {
            dispatch(fetchElementsDetail());
        }, 5000)
    };
}

export function createElementlRequest() {
    return {
        type: CREATE_PROPOSAL_REQUEST,
    };
}

export function createElementDone() {
    return {
        type: CREATE_PROPOSAL_DONE
    };
}

export function createElement(element) {
    return (dispatch) => {
        dispatch(createElementlRequest());
        ask_the_api("elements.create", element);
        setTimeout(() => {
            dispatch(createElementDone());
        }, 5000)
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

export function runElementFromCalendar(a_filter=null) {
    return (dispatch) => {
        dispatch(runElementRequest());
        ask_the_api("elements.run.from.calendar", a_filter);
    };
}

export function updateElementlRequest() {
    return {
        type: UPDATE_PROPOSAL_REQUEST,
    };
}

export function updateElement(element) {
    return (dispatch) => {
        dispatch(updateElementlRequest());
        ask_the_api("elements.update", element);
    };
}

export function saveTunedValuesReducer(id, modifications) {
    const modifications_to_update = {
        [id]: modifications,
    }

    return {
        type: UPDATE_TUNED_VALUES,
        payload: {
            modifications: modifications_to_update
        },
    };
}

export function reduceModifications(response) {
    console.debug("Reducing modifications", response);
    if (response.code == 200){
        const the_result = JSON.parse(response.result);
        const the_id = the_result.element_id;


        return saveTunedValuesReducer(the_id, the_result);
    }
    return {
        type: API_ERROR,
        payload: {
            expected: UPDATE_TUNED_VALUES,
            response: response,
        },
    };
}

export function saveTunedValues(id, modifications) {
    return (dispatch) => {
        console.debug("Saving modifications", id, modifications)
        //Save locally
        dispatch(saveTunedValuesReducer(id, modifications));

        //Save at API
        ask_the_api("modifications.update", {"element_id": id, modifications: modifications});
    };
}

export function deleteElementRequest() {
    return {
        type: DELETE_PROPOSAL_REQUEST,
    };
}

export function deleteElement(element, historical) {
    return (dispatch) => {
        dispatch(deleteElementRequest());
        ask_the_api("elements.delete", element, historical);
        setTimeout(() => {
            dispatch(fetchElements());
        }, 5000)
    };
}

export function deleteElementFromCalendar(element, historical) {
    return (dispatch) => {
        dispatch(deleteElementRequest());
        ask_the_api("elements.delete.from.calendar", element, historical);
    };
}

export function buyElementRequest() {
    return {
        type: BUY_PROPOSAL_REQUEST,
    };
}

export function buyElement(element) {
    return (dispatch) => {
        dispatch(buyElementRequest());
        ask_the_api("elements.buy", element, "elements.buy");
    };
}

export function buyElementFromCalendar(element) {
    return (dispatch) => {
        dispatch(buyElementRequest());
        ask_the_api("elements.buy.from.calendar", element, "elements.buy.from.calendar");
    };
}


/********
 PROFILE
********/


//Reduce Profile
export function overrideProfile(response, initial) {
    const message = (initial)?null:"Profile updated";

    //Set the code, or 404
    const the_code = (response.code? response.code : 404);

    //If the return is OK
    if (the_code == 200) {
        const the_result = JSON.parse(response.result);
        const the_message = response.message;

        return {
            type: RECEIVE_PROFILE,
            payload: {
                profile: the_result,
                message: the_message,
            },
        };
    }
    return {
        type: API_ERROR,
        payload: {
            expected: RECEIVE_PROFILE,
            response: response,
        },
    };
}

export function receiveProfileError(data) {
    return {
        type: RECEIVE_PROFILE_KO,
        payload: {
            data,
        },
    };
}

export function fetchProfileRequest() {
    return {
        type: FETCH_PROFILE_REQUEST,
    };
}

export function receiveUpdateProfile(data) {
    return {
        type: UPDATE_PROFILE_OK,
        payload: {
            data,
            statusText: "Changes applied correctly",
            statusType: "info",
        },
    };
}

export function receiveUpdateProfileKO(error) {
    return {
        type: UPDATE_PROFILE_KO,
        payload: {
            status: (error.status === undefined) ? "403" : error.status,
            statusText: (error.statusText === undefined) ? "The provided credentials are not correct" : error.statusText,
            statusType: "danger",
        },
    };
}

export function updateProfileRequest() {
    return {
        type: UPDATE_PROFILE_REQUEST,
    };
}
export function fetchProfile(a_filter=null, initial=true) {
    return (dispatch) => {
        dispatch(fetchProfileRequest());
        ask_the_api("profile.get", a_filter, initial )
    };
}

export function updateProfile(email, data=null, initial=false) {
    return (dispatch) => {
        dispatch(updateProfileRequest());
        ask_the_api("profile.update", email, data, initial )
    };
}


/********
 VERSION
********/


export function fetchVersionRequest(initial) {
    const message = (initial)?null:"Fetching current version detail";
    return {
        type: FETCH_VERSION_REQUEST,
        payload: {
            message,
        },
    };
}

export function fetchVersion(initial=false, PR=VERSION_PR) {
    return (dispatch) => {
        dispatch(fetchVersionRequest(initial));
        ask_the_api("version.get", PR, initial )
    };
}

//Reduce Profile
export function overrideVersion(response, initial) {
    const message = (initial)?null:"Refreshing current version detail";

    //Set the code, or 404
    const the_code = (response.code? response.code : 404);

    //If the return is OK
    if (the_code == 200) {
        const the_result = JSON.parse(response.result);
        const the_message = response.message;

        return {
            type: RECEIVE_VERSION,
            payload: {
                version: the_result,
                message: the_message,
            },
        };
    }
    return {
        type: API_ERROR,
        payload: {
            expected: RECEIVE_VERSION,
            response: response,
        },
    };
}


/**************
Session sync !
**************/


export function synchronizePendingElementsRequest() {
    const message = "(re)Processing proposal";

    return {
        type: RUN_ELEMENT_REQUEST,
        payload: {
            message,
        },
    };
}

export function synchronizePendingElements(a_filter=null) {
    return (dispatch) => {
        dispatch(synchronizePendingElementsRequest());
        ask_the_api("session.sync", a_filter);
    };
}
