import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { debug } from '../utils/debug';

import * as actionCreators from '../actions/proposal';

import { ProposalDefinition } from './ProposalDefinition';

function mapStateToProps(state) {
    return {
        aggregations: state.proposal.aggregations_list,
        settings: state.settings,
        token: state.auth.token,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export default class HistoryNewView extends React.Component {
    componentWillMount() {
        const token = this.props.token;
        this.fetchSources(token);
        this.fetchAggregations(token);
    }

    fetchAggregations(token) {
        this.props.fetchAggregations(token);
    }

    fetchSources(token) {
        this.props.fetchSources(token);
    }

    render() {
        return (
            <div>
                <div>
                    <h1>New historic</h1>

                    {this.props.aggregations && this.props.settings.loaded &&
                        <ProposalDefinition
                            aggregationsList={this.props.aggregations}
                            sourcesList={this.props.settings.data.measures}
                            type="historic"
                        />
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
