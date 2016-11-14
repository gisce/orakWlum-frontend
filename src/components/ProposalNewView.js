import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { debug } from '../utils/debug';

import * as actionCreators from '../actions/proposal';

import { ProposalDefinition } from './ProposalDefinition';

function mapStateToProps(state) {
    return {
        data: state.proposal,
        token: state.auth.token,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export default class ProfileView extends React.Component {
    componentDidMount() {
        this.fetchAggregations();
    }

    updateData(data) {
        const token = this.props.token;
        this.props.updateProfile(token, data);
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

                    {!this.props.data.loaded
                        ? <h1>Loading New proposal...</h1>
                        :
                        <ProposalDefinition aggregationsList={this.props.data.aggregations_list}/>
                    }
                </div>

                {debug(this.props.data)}
            </div>
        );
    }
}

ProfileView.propTypes = {
    data: React.PropTypes.any,
    token: React.PropTypes.string,
};
