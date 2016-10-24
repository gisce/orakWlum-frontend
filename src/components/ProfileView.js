import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/proposals';

import { ProposalList } from './ProposalList';

function mapStateToProps(state) {
    return {
        data: state.proposals,
        token: state.auth.token,
        loaded: state.proposals.loaded,
        isFetching: state.proposals.isFetching,
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
        this.props.fetchProfiles(token, userName);
    }

    render() {
        return (
            <div>
                {!this.props.loaded
                    ? <h1>Loading Profile...</h1>
                    :
                    <div>
                        <h1>Profile</h1>

                        {this.props.data.data}

                        <h3>Debug:</h3>
                        <pre>{ JSON.stringify(this.props.data, null, 2) }</pre>

                    </div>
                }
            </div>
        );
    }
}

ProfileView.propTypes = {
    fetchProtectedDataProposals: React.PropTypes.func,
    fetchProtectedData: React.PropTypes.func,
    loaded: React.PropTypes.bool,
    userName: React.PropTypes.string,
    data: React.PropTypes.any,
    token: React.PropTypes.string,
};
