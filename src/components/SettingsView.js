import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/settings';

import { SettingsSources } from './SettingsSources'

import { LoadingAnimation } from './LoadingAnimation';

import { debug } from '../utils/debug';

function mapStateToProps(state) {
    return {
        settings: state.settings,
        token: state.auth.token,
        loaded: state.settings.loaded,
        isFetching: state.settings.isFetching,
        error: state.settings.error,
        errorMessage: state.settings.data,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export default class SettingsView extends React.Component {
    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        const token = this.props.token;
        this.props.fetchSettings(token);
    }

    updateData(data) {
        const token = this.props.token;
        this.props.updateSettings(token, data);
    }

    render() {

        const data = this.props.settings.data;

        let Settings;
        if (this.props.loaded && data) {
            const {measures, static_data} = data;
            Settings=<SettingsSources measures={measures} static_data={static_data}/>
        } else {
            Settings=null;
        }

        return (
            <div>
                {
                    (!this.props.loaded) ?
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
    loaded: PropTypes.bool,
    data: PropTypes.any,
    token: PropTypes.string,
};
