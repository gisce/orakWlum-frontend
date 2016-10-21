import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actionCreators from '../actions/data';

import { Proposal } from './Proposal';

function mapStateToProps(state) {
    return {
        data: state.data,
        token: state.auth.token,
        loaded: state.data.loaded,
        isFetching: state.data.isFetching,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export default class ProposalView extends React.Component {
    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        const token = this.props.token;
        const proposal_id = this.props.params.proposalId;
        this.props.fetchProtectedDataProposal(token, proposal_id);
    }

    render() {
        const proposalId = this.props.params.proposalId;
        const proposal = this.props.data.data;

        return (
            <div>
                {!this.props.loaded
                    ? <h1>Loading Proposal {proposalId}...</h1>
                    :
                    <Proposal proposal={proposal} />
                }
            </div>
        );

    }
}

ProposalView.propTypes = {
    fetchProtectedDataProposal: React.PropTypes.func,
    fetchProtectedData: React.PropTypes.func,
    loaded: React.PropTypes.bool,
    userName: React.PropTypes.string,
    data: React.PropTypes.any,
    token: React.PropTypes.string,
};
