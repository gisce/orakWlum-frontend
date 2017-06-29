import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/orakwlum';

import { UserProfile } from './UserProfile';

import { LoadingAnimation } from 'materialized-reactions/LoadingAnimation';

import { debug } from '../utils/debug';

function mapStateToProps(state) {
    return {
        profile: state.orakwlum.profile,
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
        const userName = this.props.userName;
        this.props.fetchProfile();
    }

    updateData(data) {
        this.props.updateProfile(data);
    }

    render() {
        const {profile} = this.props;

        console.log("profile",profile, Object.keys(profile).length);

        return (
            <div>
                {
                    (Object.keys(profile).length == 0) ?
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
