import axios  from 'axios'
import { browserHistory } from 'react-router'
import { LOGIN_USER_SUCCESS, LOGIN_USER_FAILURE, LOGIN_USER_REQUEST, LOGOUT_USER, REGISTER_USER_FAILURE, REGISTER_USER_REQUEST, REGISTER_USER_SUCCESS, RECOVER_USER_REQUEST, RECOVER_USER_SUCCESS, RECOVER_USER_FAILURE } from '../constants/index'
import { define_token, undefine_token, get_token, create_user, ask_recover } from '../utils/http_functions'
import { parseJSON } from '../utils/misc'

export function loginUserSuccess(token) {
    define_token('token', token);
    return {
        type: LOGIN_USER_SUCCESS,
        payload: {
            token,
        },
    };
}

export function loginUserFailure(error) {
    undefine_token();
    return {
        type: LOGIN_USER_FAILURE,
        payload: {
            status: (error.status === undefined) ? "403" : error.status,
            statusText: (error.statusText === undefined) ? "The provided credentials are not correct" : error.statusText,
            statusType: "danger",
        },
    };
}

export function loginUserRequest() {
    return {
        type: LOGIN_USER_REQUEST,
    };
}

export function logout() {
    undefine_token();
    return {
        type: LOGOUT_USER,
    };
}

export function logoutAndRedirect() {
    return (dispatch) => {
        dispatch(logout());
        browserHistory.push('/home');
    };
}

export function redirectToRoute(route) {
    return () => {
        browserHistory.push(route);
    };
}

export function loginUser(email, password, redirect="/proposals") {
    return function(dispatch) {
        dispatch(loginUserRequest());
        return get_token(email, password)
            .then(parseJSON)
            .then(response => {
                try {
                    dispatch(loginUserSuccess(response.token));
                    browserHistory.push(redirect);
                } catch (e) {
                    alert(e);
                    dispatch(loginUserFailure({
                        response: {
                            status: 403,
                            statusText: 'Invalid token',
                            statusType: "warning",
                        },
                    }));
                }
            })
            .catch(error => {
                dispatch(loginUserFailure(error));
            });
    };
}

export function registerUserRequest() {
    return {
        type: REGISTER_USER_REQUEST,
    };
}

export function registerUserSuccess(token) {
    define_token('token', token);
    return {
        type: REGISTER_USER_SUCCESS,
        payload: {
            token,
        },
    };
}

export function registerUserFailure(error) {
    undefine_token();
    return {
        type: REGISTER_USER_FAILURE,
        payload: {
            status: error.status,
            statusText: error.statusText,
            statusType: "danger",
        },
    };
}

export function registerUser(email, password) {
    return function(dispatch) {
        dispatch(registerUserRequest());
        return create_user(email, password)
            .then(parseJSON)
            .then(response => {
                try {
                    dispatch(registerUserSuccess(response.token));
                    browserHistory.push('/proposals');
                } catch (e) {
                    dispatch(registerUserFailure({
                        response: {
                            status: 403,
                            statusText: 'Invalid token',
                            statusType: "warning",
                        },
                    }));
                }
            })
            .catch(error => {
                dispatch(registerUserFailure(error));
            });
    };
}

export function recoverUser(email) {
    return function(dispatch) {
        dispatch(recoverUserRequest());
        return ask_recover(email)
            .then(parseJSON)
            .then(response => {
                try {
                    dispatch(loginUserSuccess(response.token));
                    browserHistory.push('/main');
                } catch (e) {
                    alert(e);
                    dispatch(recoverUserFailure({
                        response: {
                            status: 403,
                            statusText: 'Invalid token',
                            statusType: "warning",
                        },
                    }));
                }
            })
            .catch(error => {
                dispatch(recoverUserFailure(error));
            });
    };
}

export function recoverUserRequest() {
    return {
        type: RECOVER_USER_REQUEST,
    };
}

export function recoverUserFailure(error) {
    return {
        type: RECOVER_USER_FAILURE,
        payload: {
            status: (error.status === undefined) ? "" : error.status,
            statusText: (error.statusText === undefined) ? "This service is not available right now. Try it in a few minutes please." : error.statusText,
            statusType: "danger",
        },
    };
}
