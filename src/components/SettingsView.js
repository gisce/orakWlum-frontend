import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/orakwlum';

import { SettingsSources } from './SettingsSources'

import { LoadingAnimation } from 'materialized-reactions/LoadingAnimation';

import { debug } from '../utils/debug';

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

        if (!sources || Object.keys(sources).length == 0) {
            this.fetchData();
        }
    }

    fetchData() {
        this.props.fetchSettings();
    }

    updateData(data) {
        const token = this.props.token;
        this.props.updateSettings(token, data);
    }

    render() {
        const {sources} = this.props;

        const Settings = (sources && "measures" in sources && "static_data" in sources)?
            <SettingsSources measures={sources.measures} static_data={sources.static_data}/>
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
                                <h1>There was an error fetching data</h1>
                                {this.props.errorMessage.message}
                            </div>
                    :
                        <div>
                            <h1>Settings</h1>

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
