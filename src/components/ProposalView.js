import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actionCreators from '../actions/proposal';
import { debug } from '../utils/debug';

import { Proposal } from './Proposal';

function mapStateToProps(state) {
    return {
        data: state.proposal,
        allAggregations: state.proposal.allAggregations,
        token: state.auth.token,
        loaded: state.proposal.loaded,
        isFetching: state.proposal.isFetching,
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
        this.props.fetchProposal(token, proposal_id, true);
    }

    render() {
        const proposalId = this.props.params.proposalId;
        const proposal = this.props.data.data;
        const allAggregations = this.props.allAggregations;

        if (proposal!=null && proposal.id == proposalId) {
            let aggregationsList = [];
            proposal.aggregations.map( function(agg, i){
                if (agg in allAggregations)
                    aggregationsList.push( allAggregations[agg]);
            })

            return (
                <div>
                    {this.props.loaded &&
                        <div>
                            <Proposal
                                proposal={proposal}
                                aggregations={aggregationsList}
                            />
                        </div>
                    }
                    {debug(this.props.data)}
                </div>
            );
        }
        return (<div>{debug(this.props.data.data)}</div>);
    }
}

ProposalView.propTypes = {
    loaded: React.PropTypes.bool,
    data: React.PropTypes.any,
    token: React.PropTypes.string,
};
