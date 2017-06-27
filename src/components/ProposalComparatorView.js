import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actionCreators from '../actions/orakwlum';
import { debug } from '../utils/debug';

import { ProposalComparator } from './ProposalComparator';

import { LoadingAnimation } from 'materialized-reactions/LoadingAnimation';

function mapStateToProps(state) {

    return {
        elements: state.orakwlum.elements,
        elements_volatile: state.orakwlum.elements_volatile,
        aggregations: state.orakwlum.aggregations,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export default class ProposalComparatorView extends React.Component {
    constructor(props){
        super(props);

        this.idA = this.props.params.elementA;
        this.idB = this.props.params.elementB;
        this.idComp = "" + this.idA + "," + this.idB;

        const {elements, elements_volatile, aggregations} = this.props;

        if (Object.keys(aggregations) == 0)
            this.fetchAggregations(true);

        if (!(this.idComp in elements_volatile))
            this.fetchComparation();

        if (!(this.idA in elements))
            this.fetchElement(this.idA)

        if (!(this.idB in elements))
            this.fetchElement(this.idB)
    }

    fetchAggregations(initial) {
        this.props.fetchAggregations(initial);
    }

    fetchComparation(initial=true) {
        this.props.fetchComparation([this.idA, this.idB], initial);
    }

    fetchElement(element, silent=true) {
        this.props.fetchElements(element, silent);
    }

    render() {
        const {elements, aggregations, elements_volatile} = this.props;

        if (elements != null && this.idA in elements && this.idB in elements && elements_volatile && this.idComp in elements_volatile) {
            const elementA = elements[this.idA];
            const elementB = elements[this.idB];
            const comparison = elements_volatile[this.idComp];

            //Prepare the Aggregations for each element
            let aggregationsListA = [];
            let aggregationsListB = [];
            let aggregationsListComparison = [];

            elementA.aggregations.map( function(agg, i){
                if (agg in aggregations)
                    aggregationsListA.push( aggregations[agg]);
            })
            elementB.aggregations.map( function(agg, i){
                if (agg in aggregations)
                    aggregationsListB.push( aggregations[agg]);
            })
            comparison.aggregations.map( function(agg, i){
                if (agg in aggregations)
                    aggregationsListComparison.push( aggregations[agg]);
            })

            //Prepare the final object for each element
            const elementA_merged = {
                element: elementA,
                aggregations: aggregationsListA,
            }
            const elementB_merged = {
                element: elementB,
                aggregations: aggregationsListB,
            }
            const comparison_merged = {
                element: comparison,
                aggregations: aggregationsListComparison,
            }

            //Prepare each title
            const typeA = (elementA.historical)?"H":"P";
            const titleA = (elementA.days_range_future)?elementA.days_range_future[0]:elementA.days_range[0];

            const typeB = (elementB.historical)?"H":"P";
            const titleB =  (elementB.days_range_future)?elementB.days_range_future[0]:elementB.days_range[0];

            return (
                <div>
                    <div>
                        <ProposalComparator
                            title={"Comparation '" + typeA + titleA + "' vs '" + typeB + titleB + "'" }
                            elementA={elementA_merged}
                            elementB={elementB_merged}
                            comparison={comparison_merged}
                            mode={"unique"}
                        />
                    </div>
                    {debug(this.props)}
                </div>
            );
        }
        return (
            <div>
                <LoadingAnimation />
                {debug(this.props)}
            </div>);
    }
}

ProposalComparatorView.propTypes = {
    loaded: PropTypes.bool,
    data: PropTypes.any,
    token: PropTypes.string,
};
