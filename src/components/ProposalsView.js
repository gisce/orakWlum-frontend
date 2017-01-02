import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/proposals';
import { debug } from '../utils/debug';

import { dispatchNewRoute} from '../utils/http_functions';

import { ProposalList } from './ProposalList';
import { ContentHeader } from './ContentHeader';

import { Notification } from './Notification';



function mapStateToProps(state) {
    return {
        data: state.proposals,
        allAggregations: state.proposals.allAggregations,
        token: state.auth.token,
        loaded: state.proposals.loaded,
        isFetching: state.proposals.isFetching,
        message_text: state.proposals.message_text,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

const style = {
    buttonAdd: {
        marginRight: 20,
    },
    buttonPosition: {
        textAlign: 'right',
    }
};

@connect(mapStateToProps, mapDispatchToProps)
export default class ProposalsView extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            message_text: null,
        };
    }
    componentDidMount() {
        this.fetchData();
    }

    fetchData(initial=true) {
        const token = this.props.token;
        this.props.fetchProtectedDataProposals(token, initial);
    }

    refreshData() {
        this.fetchData(false);
        this.setState({
            message_open: true,
        });
    }

    addProposal() {
        dispatchNewRoute("/proposals/new");
    }

    render() {
        return (
            <div>
                <Notification
                    message={this.props.message_text}
                    open={this.state.message_open}
                />

        		<ContentHeader
        		    title="Proposals List"
        		    addButton={true}
        		    addClickMethod={() => this.addProposal()}

        		    refreshButton={true}
        		    refreshClickMethod={() => this.refreshData()}
                />
            {
                this.props.loaded?
                <div>
                    <ProposalList
                        title="Last proposals"
                        proposals={this.props.data.data}
                        aggregations={this.props.allAggregations}
                        path={this.props.location.pathname}
                    />

                </div>
            :
                <div>
                    <h3>There are no Proposals to show</h3>
                </div>
            }
                {debug(this.props.data.data)}
            </div>
        );
    }
}

ProposalsView.propTypes = {
    fetchProtectedDataProposals: React.PropTypes.func,
    fetchProtectedData: React.PropTypes.func,
    loaded: React.PropTypes.bool,
    data: React.PropTypes.any,
    token: React.PropTypes.string,
};
