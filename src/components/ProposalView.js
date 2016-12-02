import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actionCreators from '../actions/proposal';
import { debug } from '../utils/debug';

import Snackbar from 'material-ui/Snackbar';

import { Proposal } from './Proposal';

function mapStateToProps(state) {
    return {
        data: state.proposal,
        allAggregations: state.proposal.allAggregations,
        token: state.auth.token,
        loaded: state.proposal.loaded,
        isFetching: state.proposal.isFetching,
        message_open: state.proposal.message_open,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export default class ProposalView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            message_open: true,
        }

    }

    componentDidMount() {
        this.fetchData();

        console.log("props.message_open");
        console.log(this.state.message_open);
    }

    fetchData() {
        const token = this.props.token;
        const proposal_id = this.props.params.proposalId;
        this.props.fetchProposal(token, proposal_id);
    }

    deactivateSnack = () => {
        console.log("deacti");

        this.setState({
            message_open: false,
        });
    };

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


            console.dir()
            const message_text = this.props.data.message_text;
            console.log("this.props.data.message_text");
            console.log(message_text);

            const message_open = this.props.data.message_open && this.state.message_open;
            console.log("this.props.data.message_open");
            console.log(message_open);
            console.log(this.props.data.message_open);


            return (
                <div>
                    {!this.props.loaded
                        ? <h1>Loading Proposal {proposalId}...</h1>
                        :
                        <div>
                        {
                            message_open &&
                                <Snackbar
                                  open={this.state.message_open}
                                  message={message_text}
                                  action="OK"
                                  autoHideDuration={4000}
                                  onRequestClose={this.deactivateSnack}
                                />
                        }
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
