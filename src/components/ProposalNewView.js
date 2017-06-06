import React from 'react';
import PropTypes from 'prop-types';
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
export default class ProfileView extends React.Component {
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
                    <h1>New proposal</h1>

                    {this.props.aggregations && this.props.settings.loaded &&
                        <ProposalDefinition
                            aggregationsList={this.props.aggregations}
                            sourcesList={this.props.settings.data.measures}
                        />
                    }
                </div>

                {debug(this.props.aggregations)}
            </div>
        );
    }
}

ProfileView.propTypes = {
    data: PropTypes.any,
    token: PropTypes.string,
};
