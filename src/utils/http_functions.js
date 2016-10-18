/* eslint camelcase: 0 */

import axios from 'axios';

const tokenConfig = (token) => ({
    headers: {
        'Authorization': token, // eslint-disable-line quote-props
    },
});

export function validate_token(token) {
    return axios.post('/api/is_token_valid', {
        token,
    });
}

export function get_github_access() {
    window.open(
        '/github-login',
        '_blank' // <- This is what makes it open in a new window.
    );
}

export function create_user(email, password) {
    return axios.post('api/create_user', {
        email,
        password,
    });
}

export function get_token(userName, password) {
    return axios.post('https://api.orakwlum.local/oauth/token',
        "client_id=1cZKwVZoC1Wv8YkmBEt7kju7FX9m3TrVAZVL9Gnf&grant_type=password&username=" + userName + "&password=" + password,
    );
/*
    return axios.post('https://api.orakwlum.local/oauth/token', {
        client_id:'1cZKwVZoC1Wv8YkmBEt7kju7FX9m3TrVAZVL9Gnf',
        grant_type:'password',
        username:"k",
        password:"k",
    });

    */
    //return axios.post('api/get_token', {
}

export function has_github_token(token) {
    return axios.get('https://api.orakwlum.local/oauth/management', tokenConfig(token));
    //return axios.get('api/has_github_token', tokenConfig(token));
}

export function data_about_user(token) {
    return axios.get('api/user', tokenConfig(token));
}
