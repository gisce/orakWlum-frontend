/* eslint camelcase: 0 */

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
    return axios.post('/api/create_user', {
        email,
        password,
    });
}

export function get_token(email, password) {
    return axios.post('/api/get_token', {
        email,
        password,
    });
}

export function ask_recover(email) {
    return axios.post('/api/recover', {
        email,
    });
}

export function has_github_token(token) {
    return axios.get('/api/has_github_token', tokenConfig(token));
}

export function data_about_user(token) {
    return axios.get('/api/user/', tokenConfig(token));
}

export function data_fetch_api_resource(token, resource) {
    return axios.get('/api/' + resource);
}

export function data_update_api_resource(token, resource, new_data) {
    return axios.put('/api/' + resource, new_data);
}
