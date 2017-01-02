import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/about';

import { UserProfile } from './UserProfile';

import { debug } from '../utils/debug';

function mapStateToProps(state) {
    return {
        loaded: true,
        profile: state.profile,
        auth: state.auth,
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
        this.props.fetchPR(token);
    }

    updateData(data) {
        const token = this.props.token;
        this.props.updateProfile(token, data);
    }

    render() {
        const version = this.props.auth.version;
        const version_pr = this.props.auth.version_pr;

        return (
            <div>
                {
                    (this.props.loaded) &&
                        <div>
                            <h1>About oraKWlum</h1>

                            {version}
                            {version_pr}

                        </div>
                }

                {debug(this.props.auth)}
            </div>
        );
    }
}

ProfileView.propTypes = {
    fetchProfile: React.PropTypes.func,
    loaded: React.PropTypes.bool,
    userName: React.PropTypes.string,
    data: React.PropTypes.any,
    token: React.PropTypes.string,
};
