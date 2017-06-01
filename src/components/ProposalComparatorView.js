import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actionCreators from '../actions/elements';
import { debug } from '../utils/debug';

import { ProposalComparator } from './ProposalComparator';

import { LoadingAnimation } from './LoadingAnimation';

function mapStateToProps(state) {

    return {
        data: state.elements,
        allAggregations: state.elements.allAggregations,
        comparison: state.elements.comparison,
        token: state.auth.token,
        loaded: state.elements.loaded,
        isFetching: state.elements.isFetching,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export default class ProposalComparatorView extends React.Component {
    componentWillMount() {
        this.idA = this.props.params.elementA;
        this.idB = this.props.params.elementB;

        this.fetchData();
    }

    fetchData() {
        const token = this.props.token;
        this.props.fetchElementsByIDS(token, [this.idA, this.idB], true);
    }

    render() {
        const elements = this.props.data.data;
        const {allAggregations, comparison} = this.props;

        if (elements != null && elements.length==2 && allAggregations != null) {
            const elementA = elements[0];
            const elementB = elements[1];

            //Prepare the Aggregations for each element
            let aggregationsListA = [];
            let aggregationsListB = [];
            let aggregationsListComparison = [];

            elementA.aggregations.map( function(agg, i){
                if (agg in allAggregations)
                    aggregationsListA.push( allAggregations[agg]);
            })
            elementB.aggregations.map( function(agg, i){
                if (agg in allAggregations)
                    aggregationsListB.push( allAggregations[agg]);
            })
            comparison.aggregations.map( function(agg, i){
                if (agg in allAggregations)
                    aggregationsListComparison.push( allAggregations[agg]);
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
                    {this.props.loaded &&
                        <div>
                            <ProposalComparator
                                title={"Comparation '" + typeA + titleA + "' vs '" + typeB + titleB + "'" }
                                elementA={elementA_merged}
                                elementB={elementB_merged}
                                comparison={comparison_merged}
                                mode={"unique"}
                            />
                        </div>
                    }
                    {debug(this.props.data)}
                </div>
            );
        }
        return (
            <div>
                <LoadingAnimation />
                {debug(this.props.data.data)}
            </div>);
    }
}

ProposalComparatorView.propTypes = {
    loaded: React.PropTypes.bool,
    data: React.PropTypes.any,
    token: React.PropTypes.string,
};
