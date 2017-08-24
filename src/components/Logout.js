import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import * as actionCreators from '../actions/auth';

function mapStateToProps(state) {
    return {
        isAuthenticated: state.auth.isAuthenticated,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

export function requireUnauthentication(Component) {

    class requireUnauthentication extends React.Component {

        constructor(props) {
            super(props);
        }

        componentWillMount() {
            this.logout();
        }

        componentWillReceiveProps(nextProps) {
            this.logout();
        }

        logout() {
            this.props.logoutAndRedirect();
        }

        render() {
            return (
                <div>
                </div>
            );
        }
    }

    requireUnauthentication.propTypes = {
        logoutAndRedirect: PropTypes.func,
    };

    return connect(mapStateToProps, mapDispatchToProps)(requireUnauthentication);
}
