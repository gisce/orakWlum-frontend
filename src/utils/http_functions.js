/* eslint camelcase: 0 */

const API_SPECIFICATION = 1;
const API_PREFIX = "/api/v" + API_SPECIFICATION;

import axios  from 'axios'

const tokenConfig = (token) => ({
    headers: {
        'Authorization': token, // eslint-disable-line quote-props
    },
});

export function define_token(token) {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = token;
}

export function undefine_token() {
    localStorage.removeItem('token');
    axios.defaults.headers.common['Authorization'] = '';
}

export function validate_token(token) {
    return axios.post(API_PREFIX + '/is_token_valid', {
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
    return axios.post(API_PREFIX + '/create_user', {
        email,
        password,
    });
}

export function get_token(email, password) {
    return axios.post(API_PREFIX + '/get_token', {
        email,
        password,
    });
}

export function ask_recover(email) {
    return axios.post(API_PREFIX + '/recover', {
        email,
    });
}

export function has_github_token(token) {
    return axios.get(API_PREFIX + '/has_github_token', tokenConfig(token));
}

export function data_about_user(token) {
    return axios.get(API_PREFIX + '/user/', tokenConfig(token));
}

export function data_fetch_api_resource(token, resource) {
    return axios.get(API_PREFIX + "/" + resource);
}

export function data_update_api_resource(token, resource, new_data) {
    return axios.put(API_PREFIX + "/" + resource, new_data);
}
