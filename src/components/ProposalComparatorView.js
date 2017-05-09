import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actionCreators from '../actions/elements';
import { debug } from '../utils/debug';

import { ProposalComparator } from './ProposalComparator';

function mapStateToProps(state) {

    return {
        data: state.elements,
        allAggregations: state.elements.allAggregations,
        token: state.auth.token,
        loaded: state.elements.loaded,
        isFetching: state.elements.isFetching,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export default class ProposalView extends React.Component {
    componentWillMount() {
        this.idA = this.props.params.elementA;
        this.idB = this.props.params.elementB;

        this.fetchData();
    }

    fetchData() {
        const token = this.props.token;
        this.props.fetchElements(token, [this.idA, this.idB], true);
    }

    render() {
        const elements = this.props.data.data;
        const allAggregations = this.props.allAggregations;

        if (elements != null && elements.length>=2 && allAggregations != null) {
            const elementA = elements[0];
            const elementB = elements[1];

            //Prepare the Aggregations for each element
            let aggregationsListA = [];
            let aggregationsListB = [];

            elementA.aggregations.map( function(agg, i){
                if (agg in allAggregations)
                    aggregationsListA.push( allAggregations[agg]);
            })
            elementB.aggregations.map( function(agg, i){
                if (agg in allAggregations)
                    aggregationsListB.push( allAggregations[agg]);
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

            return (
                <div>
                    {this.props.loaded &&
                        <div>
                            <ProposalComparator
                                title={"Comparing '" + elementA.days_range_future[0] + "' vs '" + elementB.days_range_future[0] + "'" }
                                elementA={elementA_merged}
                                elementB={elementB_merged}
                                mode="horizontal"
                            />
                        </div>
                    }
                    {debug(this.props.data)}
                </div>
            );
        }
        return (<div>{debug(this.props.data.data)}</div>);
    }
}

ProposalView.propTypes = {
    loaded: React.PropTypes.bool,
    data: React.PropTypes.any,
    token: React.PropTypes.string,
};
