import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/orakwlum';

import { SmartTable } from 'materialized-reactions/SmartTable';
import { LoadingAnimation } from 'materialized-reactions/LoadingAnimation';

import { debug } from '../utils/debug';

function mapStateToProps(state) {
    return {
        error: state.aggregations.error,
        errorMessage: state.aggregations.data,
        aggregations: state.orakwlum.aggregations,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export default class AggregationsView extends React.Component {
    componentDidMount() {
        if (Object.keys(this.props.aggregations).length == 0)
            this.fetchData();
    }

    fetchData(silent = true) {
        const the_filter = null;
        this.props.fetchAggregations(the_filter, silent);
    }

    render() {
        let Aggregations;
        const {aggregations} = this.props;

        if (aggregations && Object.keys(aggregations).length > 0) {
            const headers = [
                {
                    title: 'Name',
                    width: null,
                },                {
                    title: 'Short name',
                    width: null,
                },                {
                    title: 'DB Fields',
                    width: '30%',
                },                {
                    title: 'Status',
                    width: null,
                },
            ];

            //Adapt Aggregations List
            const aggregations_adapted = Object.keys(aggregations).map(function( aggregation, index){
                const entry = aggregations[aggregation];
                const db_fields = entry.db_fields.map(function(field, index){
                    const separator = (index==0)? "":", ";
                    return separator + field;
                })

                return (
                    [
                        entry.name,
                        entry.lite,
                        db_fields,
                        entry.status.full,
                    ]
                )
            })

            Aggregations = <SmartTable header={headers} data={aggregations_adapted}/>
        }

        return (
            <div>
                {
                    (Object.keys(aggregations).length == 0) ?
                        <LoadingAnimation /> ||
                        this.props.error &&
                            <div>
                                <h1>There was an error</h1>
                                {this.props.errorMessage.message}
                            </div>
                    :
                        <div>
                            <h1>Aggregations</h1>
                            {Aggregations}
                        </div>
                }
                {debug(this.props.data)}
            </div>
        );
    }
}

AggregationsView.propTypes = {
    aggregations: PropTypes.object,
    fetchAggregations: PropTypes.func,
    loaded: PropTypes.bool,
    data: PropTypes.any,
    token: PropTypes.string,
};
