import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actionCreators from '../actions/data';

import { ProposalsList } from './ProposalsList';


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
        console.log("mounting proposal");
        this.fetchData();
    }

    fetchData() {
        const token = this.props.token;
        const proposal_id = this.props.params.proposalId;
        this.props.fetchProtectedDataProposal(token, proposal_id);
    }

    render() {
        const proposalId = this.props.params.proposalId;

        return (
            <div>
                {!this.props.loaded
                    ? <h1>Loading data...</h1>
                    :
                    <div>
                        <h1>Proposal {proposalId}</h1>

                        <h3>Proposals:</h3>
                        <pre>{ JSON.stringify(this.props.data, null, 2) }</pre>


/*
                        <ProposalsList
                            title="Last proposals"
                            proposals={this.props.data.data}
                            path={this.props.location.pathname}
                        />
*/

                    </div>
                }
            </div>
        );
    }
}

ProposalView.propTypes = {
    fetchProtectedDataProposals: React.PropTypes.func,
    fetchProtectedData: React.PropTypes.func,
    loaded: React.PropTypes.bool,
    userName: React.PropTypes.string,
    data: React.PropTypes.any,
    token: React.PropTypes.string,
};
