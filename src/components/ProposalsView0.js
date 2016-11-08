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
export default class ProposalsView extends React.Component {
    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        const token = this.props.token;
        this.props.fetchProtectedDataProposals(token);
    }

    render() {
        return (
            <div>
                {!this.props.loaded
                    ? <h1>Loading Proposals...</h1>
                    :
                    <div>
                        <h1>Proposals list</h1>

                        <ProposalList
                            title="Last proposals"
                            proposals={this.props.data.data}
                            path={this.props.location.pathname}
                        />

                        <h3>Proposals:</h3>
                        <pre>{ JSON.stringify(this.props.data, null, 2) }</pre>

                    </div>
                }
            </div>
        );
    }
}

ProposalsView.propTypes = {
    fetchProtectedDataProposals: React.PropTypes.func,
    fetchProtectedData: React.PropTypes.func,
    loaded: React.PropTypes.bool,
    userName: React.PropTypes.string,
    data: React.PropTypes.any,
    token: React.PropTypes.string,
};
