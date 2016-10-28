import jwtDecode from 'jwt-decode';

import { createReducer } from '../utils/misc';
import {
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAILURE,
    LOGIN_USER_REQUEST,
    LOGOUT_USER,
    REGISTER_USER_FAILURE,
    REGISTER_USER_REQUEST,
    REGISTER_USER_SUCCESS,
    RECOVER_USER_SUCCESS,
    RECOVER_USER_FAILURE,

} from '../constants/index';

const initialState = {
    token: null,
    userName: null,
    userRoles: null,
    userGroups: null,
    userImage: null,
    isAuthenticated: false,
    isAuthenticating: false,
    statusText: null,
    isRegistering: false,
    isRegistered: false,
    registerStatusText: null,
};

export default createReducer(initialState, {
    [LOGIN_USER_REQUEST]: (state) =>
        Object.assign({}, state, {
            isAuthenticating: true,
            statusText: null,
        }),
    [LOGIN_USER_SUCCESS]: (state, payload) =>
        Object.assign({}, state, {
            isAuthenticating: false,
            isAuthenticated: true,
            token: payload.token,
            userName: jwtDecode(payload.token).email,
            userRoles: jwtDecode(payload.token).roles,
            userGroups: jwtDecode(payload.token).groups,
            userImage: jwtDecode(payload.token).image,
            statusText: 'You have been successfully logged in.',
        }),
    [LOGIN_USER_FAILURE]: (state, payload) =>
        Object.assign({}, state, {
            isAuthenticating: false,
            isAuthenticated: false,
            token: null,
            userName: null,
            userRoles: null,
            userGroups: null,
            userImage: null,
            statusText: `Authentication Error: ${payload.status} ${payload.statusText}`,
        }),
    [LOGOUT_USER]: (state) =>
        Object.assign({}, state, {
            isAuthenticated: false,
            token: null,
            userName: null,
            userRoles: null,
            userGroups: null,
            userImage: null,
            statusText: 'You have been successfully logged out.',
        }),
    [REGISTER_USER_SUCCESS]: (state, payload) =>
        Object.assign({}, state, {
            isAuthenticating: false,
            isAuthenticated: true,
            isRegistering: false,
            token: payload.token,
            userName: jwtDecode(payload.token).email,
            userRoles: jwtDecode(payload.token).roles,
            userGroups: jwtDecode(payload.token).groups,
            userImage: jwtDecode(payload.token).image,
            registerStatusText: 'You have been successfully logged in.',
        }),
    [REGISTER_USER_REQUEST]: (state) =>
        Object.assign({}, state, {
            isRegistering: true,
        }),
    [REGISTER_USER_FAILURE]: (state, payload) =>
        Object.assign({}, state, {
            isAuthenticated: false,
            token: null,
            userName: null,
            userRoles: null,
            userGroups: null,
            userImage: null,
            registerStatusText: `Register Error: ${payload.status} ${payload.statusText}`,
        }),
    [RECOVER_USER_SUCCESS]: (state, payload) =>
        Object.assign({}, state, {
            isAuthenticating: false,
            isAuthenticated: false,
            token: null,
            userName: null,
            userRoles: null,
            userGroups: null,
            userImage: null,
            statusText: 'If the provided account is valid, you will receive a recovery email.',
        }),
    [RECOVER_USER_FAILURE]: (state, payload) =>
        Object.assign({}, state, {
            isAuthenticating: false,
            isAuthenticated: false,
            token: null,
            userName: null,
            userRoles: null,
            userGroups: null,
            userImage: null,
            statusText: `Recovery Error: ${payload.status} ${payload.statusText}`,
            statusType: `${payload.statusType}`,
        }),
});
