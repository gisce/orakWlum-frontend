import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actionCreators from '../actions/historical';
import { debug } from '../utils/debug';

import { Historical } from './Historical';

import { LoadingAnimation } from './LoadingAnimation';

function mapStateToProps(state) {
    return {
        data: state.historical,
        allAggregations: state.historical.allAggregations,
        token: state.auth.token,
        loaded: state.historical.loaded,
        isFetching: state.historical.isFetching,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export default class HistoricalView extends React.Component {
    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        const token = this.props.token;
        const historical_id = this.props.params.historicalId;
        this.props.fetchHistorical(token, historical_id, true);
    }

    render() {
        const historicalId = this.props.params.historicalId;
        const historical = this.props.data.data;
        const allAggregations = this.props.allAggregations;

        if (historical!=null && historical.id == historicalId) {
            let aggregationsList = [];
            historical.aggregations.map( function(agg, i){
                if (agg in allAggregations)
                    aggregationsList.push( allAggregations[agg]);
            })

            return (
                <div>
                    {this.props.loaded &&
                        <div>
                            <Historical
                                proposal={historical}
                                aggregations={aggregationsList}
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

HistoricalView.propTypes = {
    loaded: PropTypes.bool,
    data: PropTypes.any,
    token: PropTypes.string,
};
