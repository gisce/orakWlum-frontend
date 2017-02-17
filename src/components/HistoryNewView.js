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
export default class HistoryNewView extends React.Component {
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

                    <h1>New historic</h1>

                    {this.props.aggregations &&
                        <ProposalDefinition aggregationsList={this.props.aggregations} type="historic"/>
                    }
                </div>

                {debug(this.props.aggregations)}
            </div>
        );
    }
}

HistoryNewView.propTypes = {
    data: React.PropTypes.any,
    token: React.PropTypes.string,
};
