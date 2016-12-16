import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { debug } from '../utils/debug';

import * as actionCreators from '../actions/proposal';

import { ProposalDefinition } from './ProposalDefinition';

function mapStateToProps(state) {
    return {
        aggregations: state.proposal.aggregations_list,
        token: state.auth.token,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export default class ProfileView extends React.Component {
    componentWillMount() {
        this.fetchAggregations();
    }

    fetchAggregations() {
        const token = this.props.token;
        this.props.fetchAggregations(token);
    }

    render() {
        return (
            <div>

                <div>

                    <h1>New proposal</h1>

                    {!this.props.aggregations
                        ? <h1>Loading New proposal...</h1>
                        :
                        <ProposalDefinition aggregationsList={this.props.aggregations}/>
                    }
                </div>

                {debug(this.props.aggregations)}
            </div>
        );
    }
}

ProfileView.propTypes = {
    data: React.PropTypes.any,
    token: React.PropTypes.string,
};
