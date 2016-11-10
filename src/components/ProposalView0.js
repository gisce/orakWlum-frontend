import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actionCreators from '../actions/proposal0';
import { debug } from '../utils/debug';

import { Proposal0 } from './Proposal0';

function mapStateToProps(state) {
    return {
        data: state.proposal0,
        token: state.auth.token,
        loaded: state.proposal0.loaded,
        isFetching: state.proposal0.isFetching,
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
        this.props.fetchProposal(token, proposal_id);
    }

    render() {
        const proposalId = this.props.params.proposalId;
        const proposal = this.props.data.data;

        console.dir(this.props.data);

        //if (proposal!=null && proposal.id == proposalId) {
            return (
                <div>
                    {!this.props.loaded
                        ? <h1>Loading Proposal {proposalId}...</h1>
                        :
                        <Proposal0 proposal={proposal} />
                    }
                    {debug(this.props.data)}
                </div>
            );
        //}
        //return (<div><pre>{this.props}</pre></div>);
    }
}

ProposalView.propTypes = {
    loaded: React.PropTypes.bool,
    data: React.PropTypes.any,
    token: React.PropTypes.string,
};
