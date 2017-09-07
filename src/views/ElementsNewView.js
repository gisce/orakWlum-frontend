import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { debug } from '../utils/debug';

import * as actionCreators from '../actions/orakwlum';

import { ElementDefinition } from '../components/ElementDefinition';

import { localized_time } from '../constants'

function mapStateToProps(state) {
    return {
        sources: state.orakwlum.sources,
        aggregations: state.orakwlum.aggregations,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export default class ProfileView extends React.Component {
    constructor(props){
        super(props);

        this.default_values = {
            type: "proposal",
        }

        if ('day_start' in props.params)
            this.default_values['start_date'] = localized_time(props.params.day_start, "DDMMYYYY").toDate();

        if ('day_end' in props.params)
            this.default_values['end_date'] = localized_time(props.params.day_end, "DDMMYYYY").toDate();

    }
    componentWillMount() {
        const {aggregations, sources} = this.props;

        if (!aggregations || Object.keys(aggregations) == 0)
            this.fetchAggregations(true);

        if (!sources || Object.keys(sources).length == 0)
            this.fetchSources();
    }

    fetchAggregations(initial) {
        this.props.fetchAggregations(initial);
    }

    fetchSources() {
        this.props.fetchSettings();
    }

    render() {
        const {sources, aggregations} = this.props;

        return (
            <div>
                <div>
                    <h1>New element</h1>

                    { Object.entries(aggregations).length > 0  &&  Object.entries(sources).length > 0  &&  "measures" in sources &&
                        <ElementDefinition
                            aggregationsList={aggregations}
                            sourcesList={sources.measures}
                            defaultValue={this.default_values}
                        />
                    }
                </div>

                {debug(this.props.aggregations)}
            </div>
        );
    }
}

ProfileView.propTypes = {
    data: PropTypes.any,
    token: PropTypes.string,
};
