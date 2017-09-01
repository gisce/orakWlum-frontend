import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actionCreators from '../actions/orakwlum';
import { debug } from '../utils/debug';

import { Elementt } from '../components/Element';
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
        if (!(elementID in elements))
            this.fetchElements(elementID, true);

        if (Object.keys(aggregations) == 0)
            this.fetchAggregations(true);
	}

    componentDidMount() {
    }

    fetchAggregations(initial) {
        this.props.fetchAggregations(initial);
    }

    fetchElements(element_id, initial) {
        this.props.fetchElements(element_id, initial);
    }

    //Fetch all needed data
    fetchData() {
        const element_id = this.props.params.elementID;
        this.fetchAggregations(false);
        this.fetchElements(element_id, false);
    }

    render() {
        const elementID = this.props.params.elementID;
        const {aggregations, elements} = this.props;

        const element = elements[elementID];

        // Render Element if data is reached
        if (element != undefined && element.id == elementID && aggregations != undefined && Object.keys(aggregations) != 0) {
            let aggregationsList = [];
            element.aggregations.map( function(agg, i){
                if (agg in aggregations)
                    aggregationsList.push( aggregations[agg]);
            })

            return (
                <div>
                    <div>
                        <Elementt
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
                    {debug(this.props)}
                </div>
            );
        }
    }
}

ElementView.propTypes = {
    elements: PropTypes.object,
    aggregations: PropTypes.array,
};
