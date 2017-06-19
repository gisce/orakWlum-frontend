import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/profile';

import { UserProfile } from './UserProfile';

import { LoadingAnimation } from 'materialized-reactions/LoadingAnimation';

import { debug } from '../utils/debug';

function mapStateToProps(state) {
    return {
        data: state.profile,
        token: state.auth.token,
        loaded: state.profile.loaded,
        isFetching: state.profile.isFetching,
        error: state.profile.error,
        errorMessage: state.profile.data,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export default class ProfileView extends React.Component {
    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        const token = this.props.token;
        const userName = this.props.userName;
        this.props.fetchProfile(token);
    }

    updateData(data) {
        const token = this.props.token;
        this.props.updateProfile(token, data);
    }

    render() {
        return (
            <div>
                {
                    (!this.props.loaded) ?
                        <LoadingAnimation /> ||
                        this.props.error &&
                            <div>
                                <h1>There was an error</h1>
                                {this.props.errorMessage.message}
                            </div>
                    :
                        <div>
                            <h1>Your profile</h1>
                            <UserProfile onUpdate={(changed_data) => this.updateData(changed_data)}/>
                        </div>
                }

                {debug(this.props.data)}
            </div>
        );
    }
}

ProfileView.propTypes = {
    fetchProfile: PropTypes.func,
    loaded: PropTypes.bool,
    userName: PropTypes.string,
    data: PropTypes.any,
    token: PropTypes.string,
};
