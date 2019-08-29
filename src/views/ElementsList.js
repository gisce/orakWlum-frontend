import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/orakwlum';

//import { ElementsDashboard } from './ElementsDashboard';
import ElementsDashboard from '../components/ElementsDashboardCalendar';

import { LoadingAnimation } from 'materialized-reactions/LoadingAnimation';

import { debug } from '../utils/debug';
import { socket, ask_the_api } from '../utils/http_functions';

import {FormattedHTMLMessage} from 'react-intl';

function mapStateToProps(state) {
    return {
        elements: state.orakwlum.elements,
        message: state.orakwlum.message,
        aggregations: state.orakwlum.aggregations,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export default class ElementsList extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    fetchAggregations(silent) {
        const the_filter = null;
        this.props.fetchAggregations(the_filter, silent);
    }

    fetchElements(silent) {
        const the_filter = null;
        this.props.fetchElements(the_filter, silent);
    }

    overrideElements(silent) {
        const the_filter = null;
        const override = true;
        this.props.fetchElements(the_filter, silent, override);
    }

    render() {
        const the_path = this.props.location.pathname;
        const {elements} = this.props;

        return (
            <div>
                <ElementsDashboard
                    title={<FormattedHTMLMessage id="ElementsList.lastproposals" defaultMessage="Last proposals"/>}
                    path={the_path}
                />
            </div>
        );
    }
}

ElementsList.propTypes = {
};
