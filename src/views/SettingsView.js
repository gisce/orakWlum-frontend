import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/orakwlum';

import { SettingsSources } from '../components/SettingsSources'

import { LoadingAnimation } from 'materialized-reactions/LoadingAnimation';

import { debug } from '../utils/debug';

import {FormattedHTMLMessage} from 'react-intl';

function mapStateToProps(state) {
    return {
        sources: state.orakwlum.sources,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export default class SettingsView extends React.Component {
    componentDidMount() {
        const {sources} = this.props;

        //if (!sources || Object.keys(sources).length == 0) {
            this.fetchData();
        //}
    }

    fetchData() {
        this.props.fetchSettings();
    }

    toggleStatus(data) {
        this.props.toggleSourceSettings(data);
    }

    render() {
        const {sources} = this.props;

        const Settings = (sources && "measures" in sources && "static_data" in sources && "losses" in sources)?
            <SettingsSources
                measures={sources.measures}
                static_data={sources.static_data}
                losses={sources.losses}
                onToggle={(data) => this.toggleStatus(data)}
            />
            :
            null
        ;

        return (
            <div>
                {
                    (!Settings) ?
                        <LoadingAnimation /> ||
                        this.props.error &&
                            <div>
                                <h1>
                                <FormattedHTMLMessage id="SettingsView.error"
                                defaultMessage="There was an error fetching data."/>
                                </h1>
                                {this.props.errorMessage.message}
                            </div>
                    :
                        <div>
                            <h1>
                            <FormattedHTMLMessage id="SettingsView.sources"
                                  defaultMessage="Sources"/>
                            </h1>

                            {Settings}
                        </div>
                }

                {debug(this.props.settings)}
            </div>
        );
    }
}

SettingsView.propTypes = {
    fetchSettings: PropTypes.func,
};
