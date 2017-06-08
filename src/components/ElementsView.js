import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//import * as actionCreators from '../actions/elements';
import * as actionCreators from '../actions/proposals';

import { debug } from '../utils/debug';

import { dispatchNewRoute} from '../utils/http_functions';

import { ElementsDashboard } from './ElementsDashboard';
import { ContentHeader } from './ContentHeader';

import { Notification } from './Notification';
import { LoadingAnimation } from 'materialized-reactions/LoadingAnimation';



function mapStateToProps(state) {
    return {
        data: state.proposals,
        allAggregations: state.proposals.allAggregations,
        token: state.auth.token,
        loaded: state.proposals.loaded,
        isFetching: state.proposals.isFetching,
        message_text: state.proposals.message_text,
    };

    return {
        data: state.elements,
        allAggregations: state.elements.allAggregations,
        token: state.auth.token,
        loaded: state.elements.loaded,
        isFetching: state.elements.isFetching,
        message_text: state.elements.message_text,
    };

}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

const style = {
};

@connect(mapStateToProps, mapDispatchToProps)
export default class ElementsView extends React.Component {
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
        this.props.fetchProposals(token, initial);
        //this.props.fetchElements(token, initial);
    }

    refreshData() {
        this.fetchData(false);
        this.setState({
            message_open: true,
        });
    }

    addElement(event) {
        dispatchNewRoute("/proposals/new", event);
    }

    render() {
        const the_elements = this.props.data.data;
        const the_aggregations = this.props.allAggregations;
        const the_path = this.props.location.pathname;

        return (
            <div>
                <Notification
                    message={this.props.message_text}
                    open={this.state.message_open}
                />

                <ContentHeader
        		    title="Dashboard"
        		    addButton={true}
        		    addClickMethod={(event) => this.addElement(event)}

        		    refreshButton={true}
        		    refreshClickMethod={() => this.refreshData()}
                />
            {
                this.props.loaded?
                <div>
                    <ElementsDashboard
                        title="Last proposals"
                        path={the_path}

                        elements={the_elements}
                        aggregations={the_aggregations}
                    />

                </div>
            :
                <div>
                    <LoadingAnimation />
                </div>
            }
                {debug(this.props.data.data)}
            </div>
        );
    }
}

ElementsView.propTypes = {
    fetchProposals: PropTypes.func,
    loaded: PropTypes.bool,
    data: PropTypes.any,
    token: PropTypes.string,
};
