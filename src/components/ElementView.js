import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actionCreators from '../actions/orakwlum';
import { debug } from '../utils/debug';

import { Proposal } from './Proposal';
import { LoadingAnimation } from 'materialized-reactions/LoadingAnimation';

function mapStateToProps(state) {
    return {
        token: state.auth.token,

        loaded: state.orakwlum.loaded,
        isFetching: state.orakwlum.isFetching,

        elements: state.orakwlum.elements,
        aggregations: state.orakwlum.aggregations,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export default class ElementView extends React.Component {
    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        const token = this.props.token;
        const element_id = this.props.params.elementID;
        //this.props.fetchProposal(token, element_id, true);
    }

    render() {
        const elementID = this.props.params.elementID;

        const {aggregations, elements} = this.props;
        const allAggregations = aggregations;
        
        const element = elements[elementID];

        if (element != null && element.id == elementID) {
            let aggregationsList = [];
            element.aggregations.map( function(agg, i){
                if (agg in allAggregations)
                    aggregationsList.push( allAggregations[agg]);
            })

            return (
                <div>
                        <div>
                            <Proposal
                                proposal={element}
                                aggregations={aggregationsList}
                            />
                        </div>
        
                        {debug(this.props.data)}
                </div>
            );
        } else {
            //try to fetch it!
            return (
                <div>
                    <LoadingAnimation />
                    {debug(this.props.data.data)}
                </div>
            );
        }
    }
}

ElementView.propTypes = {
    loaded: PropTypes.bool,
    elements: PropTypes.object,
    aggregations: PropTypes.array,
    token: PropTypes.string,
};
