import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/settings';


import { SmartTable } from './SmartTable'

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

            //Adapt measures
            const measures_adapted = measures.map(function( entry, index){
                const active = (entry.active)?"Active":"Deactivated";
                const db_fields = entry.config[0] + ":" + entry.config[1] + "@" + entry.config[2] + "/" + entry.config[3];
                return (
                    [
                        entry.name,
                        entry.alias,
                        entry.type,
                        entry.unit,
                        db_fields,
                        active,
                    ]
                )
            })


            //Adapt static data
            const static_data_adapted = static_data.map(function( entry, index){
                const active = (entry.active)?"Active":"Deactivated";
                const db_fields = entry.config[0] + ":" + entry.config[1] + "@" + entry.config[2] + "/" + entry.config[3];
                return (
                    [
                        entry.name,
                        entry.alias,
                        entry.type,
                        entry.unit,
                        db_fields,
                        active,
                    ]
                )
            })

            const headers = [
                {
                    title: 'Name',
                    width: null,
                },                {
                    title: 'Alias',
                    width: null,
                },                {
                    title: 'Type',
                    width: '10%',
                },                {
                    title: 'Unit',
                    width: '10%',
                },                {
                    title: 'DB',
                    width: '30%',
                },                {
                    title: 'Status',
                    width: null,
                },
            ];



            Settings=(
                <div>
                    <h2>Available sources</h2>
                    <SmartTable title="Measures" header={headers} data={measures_adapted}/>
                    <SmartTable title="Static Data" header={headers} data={static_data_adapted}/>
                </div>
            )
        } else {
            Settings=null;
        }

        return (
            <div>
                {
                    (!this.props.loaded) ?

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
    fetchSettings: React.PropTypes.func,
    loaded: React.PropTypes.bool,
    data: React.PropTypes.any,
    token: React.PropTypes.string,
};
