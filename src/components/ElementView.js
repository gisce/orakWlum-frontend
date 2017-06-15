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
        elements: state.orakwlum.elements,
        aggregations: state.orakwlum.aggregations,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export default class ElementView extends React.Component {
    constructor(props) {
        super(props);

        const elementID = this.props.params.elementID;
        const {aggregations, elements} = this.props;

        //Review if the element has been downloaded
        if (!(elementID in elements)){
            this.fetchData();
        }
	}

    componentDidMount() {
    }

    //Fetch all needed data
    fetchData() {
        const element_id = this.props.params.elementID;
        this.props.fetchAggregations(true);
        this.props.fetchElements(element_id, true);
    }

    render() {
        const elementID = this.props.params.elementID;
        const {aggregations, elements} = this.props;
        
        const element = elements[elementID];

        // Render Element if data is reached
        if (element != undefined && element.id == elementID && aggregations != undefined) {
            let aggregationsList = [];
            element.aggregations.map( function(agg, i){
                if (agg in aggregations)
                    aggregationsList.push( aggregations[agg]);
            })

            return (
                <div>
                    <div>
                        <Proposal
                            proposal={element}
                            aggregations={aggregationsList}
                        />
                    </div>
        
                    {debug(element)}
                </div>
            );

        } else {
            return (
                <div>
                    <LoadingAnimation />
                    {debug(element)}
                </div>
            );
        }
    }
}

ElementView.propTypes = {
    elements: PropTypes.object,
    aggregations: PropTypes.array,
};
