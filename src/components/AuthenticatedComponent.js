import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import * as actionCreators from '../actions/auth';

import { validate_token, createSocket } from '../utils/http_functions'
import {Connection} from './Connection';

function mapStateToProps(state) {
    return {
        token: state.auth.token,
        userName: state.auth.userName,
        isAuthenticated: state.auth.isAuthenticated,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

export function requireAuthentication(Component) {
    class AuthenticatedComponent extends React.Component {
        componentWillMount() {
            this.checkAuth();
            this.state = {
                loaded_if_needed: false,
            };
        }

        componentWillReceiveProps(nextProps) {
            this.checkAuth(nextProps);
        }

        checkAuth(props = this.props) {
            const token = localStorage.getItem('token');

            if (!props.isAuthenticated) {
                if (!token) {
                    browserHistory.push('/login?next=' + props.route.path);
                } else {

                    validate_token(token)
                        .then(res => {
                            if (res.status === 200) {
                                this.props.loginUserSuccess(token);
                                this.setState({
                                    loaded_if_needed: true,
                                });

                                createSocket(token);

                            } else {
                                browserHistory.push('/login?next=' + props.route.path);
                            }
                        })
                        .catch(error => {
                            localStorage.removeItem('token');
                            browserHistory.push('/login?next=' + props.route.path);
                        });
                }
            } else {
                //Create socket if needed
                if (!window.socket) {
                    createSocket(token);
                }

                this.setState({
                    loaded_if_needed: true,
                });
            }
        }

        render() {
            return (
                <div>
                    {this.props.isAuthenticated && this.state.loaded_if_needed
                        ? <div><Connection /><Component {...this.props} /></div>
                        : null
                    }
                </div>
            );

        }
    }

    AuthenticatedComponent.propTypes = {
        loginUserSuccess: PropTypes.func,
        isAuthenticated: PropTypes.bool,
    };

    return connect(mapStateToProps, mapDispatchToProps)(AuthenticatedComponent);
}
