/* eslint max-len: 0, no-param-reassign: 0 */

//import {md5} from 'blueimp-md5/js/md5';
var md5 = require("../../node_modules/blueimp-md5/js/md5.js");

export function capitalize(the_string) {
    return the_string.charAt(0).toUpperCase() + the_string.slice(1);
}

export function createConstants(...constants) {
    return constants.reduce((acc, constant) => {
        acc[constant] = constant;
        return acc;
    }, {});
}

export function createReducer(initialState, reducerMap) {
    return (state = initialState, action) => {
        const reducer = reducerMap[action.type];


        return reducer
            ? reducer(state, action.payload)
            : state;
    };
}

export function parseJSON(response) {
    return response.data;
}

export function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

export function MD5(text){
    return md5(text);
}

export function date_to_string(a_date, string_format="%d/%m/%Y"){
    if (!a_date){
        return null;
    }

    const full_year = a_date.getFullYear();
    const year = ("" + full_year).slice(-2);

    const month = ("0" + (a_date.getMonth()+1)).slice(-2);
    const day = ("0" + a_date.getDate()).slice(-2);

    return string_format
            .replace("%d", day)
            .replace("%m", month)
            .replace("%Y", full_year)
            .replace("%y", year)
}

//Date formatter
export const formatDate = (date) => {
    return date_to_string(date).replace(/\//g, " / ");
}

//Date formatter
export const formatDateFromAPI = (date) => {
    return date_to_string(date, "%Y-%m-%d");
}

//RoundUP with fixed decimals
export const roundUp = (num, dec) => {
  const precision = Math.abs(parseInt(dec)) || 0;
  let multiplier = Math.pow(10, precision);
  return Number(Math.ceil(num * multiplier) / multiplier).toFixed(precision);
}
