import React, { Component } from 'react'

import { SmartTable } from '../SmartTable'

const styles = {
};

export class SettingsSources extends Component {

    render() {
        const {measures, static_data} = this.props;

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

        const Settings=(
            <div>
                <h2>Available sources</h2>
                <SmartTable title="Measures" header={headers} data={measures_adapted}/>
                <SmartTable title="Static Data" header={headers} data={static_data_adapted}/>
            </div>
        )

        return Settings;
    }
}

SettingsSources.propTypes = {
    measures: React.PropTypes.array.isRequired,
    static_data: React.PropTypes.array.isRequired,
};
