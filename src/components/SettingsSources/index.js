import React from 'react';
import PropTypes from 'prop-types';
import { SmartTable } from 'materialized-reactions/SmartTable';

const styles = {
};

export class SettingsSources extends React.Component {
    render() {
        const {measures, static_data, losses, onToggle} = this.props;

        if (Object.keys(measures).length > 0 && Object.keys(static_data).length > 0 && Object.keys(losses).length > 0) {

            //Adapt measures
            const measures_adapted = measures.map(function( entry, index){
                const active = (entry.active)?"Active":"Deactivated";
                const db_fields = entry.config[0] + ":" + entry.config[1] + "@" + entry.config[2] + "/" + entry.config[3];
                return (
                    [
                        entry._id,
                        entry.name,
                        entry.alias,
                        entry.type,
                        entry.unit,
                        db_fields,
                        entry.priority,
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
                        entry._id,
                        entry.name,
                        entry.alias,
                        entry.type,
                        entry.unit,
                        db_fields,
                        entry.priority,
                        active,
                    ]
                )
            })

            //Adapt losses
            const losses_adapted = losses.map(function( entry, index){
                const active = (entry.active)?"Active":"Deactivated";
                const db_fields = entry.config[0] + ":" + entry.config[1] + "@" + entry.config[2] + "/" + entry.config[3];
                return (
                    [
                        entry._id,
                        entry.name,
                        entry.alias,
                        entry.type,
                        entry.unit,
                        db_fields,
                        entry.priority,
                        active,
                    ]
                )
            })

            const headers = [
                {
                    title: 'ID',
                    width: null,
                    hide: true,
                },{
                    title: 'Name',
                    width: null,
                },{
                    title: 'Alias',
                    width: null,
                },{
                    title: 'Type',
                    width: '10%',
                },{
                    title: 'Unit',
                    width: '10%',
                },{
                    title: 'DB',
                    width: '30%',
                },{
                    title: 'Priority',
                    width: '10%',
                },{
                    title: 'Status',
                    width: null,
                },
            ];

            //Toggle Status BUTTON to inject in SmartTable
            const toggle_active = [
                {
                    'label': 'Toggle Status',
                    'action':
                        function(e, selectedIDs, onUpdate) {
                            e.preventDefault();

                            const sources_parsed = (selectedIDs)?
                                selectedIDs.map( function(entry, idx) {
                                    return {
                                        "name": entry[0],
                                        "alias": entry[1],
                                        "type": entry[2],
                                        "unit": entry[3],
                                        "db": entry[4],
                                        "priority": entry[5],
                                        "active": entry[6],
                                    }
                                })
                                :
                                null;


                            // Try to update data
                            if (onUpdate) {
                                onUpdate(selectedIDs);
                            }
                        }
                },
            ]

            const Settings = (this.props.lite)?
            <SmartTable header={headers} data={measures_adapted}/>
            :
            (
                <div>
                    <h2>Available sources</h2>
                    <SmartTable
                        title="Measures"
                        header={headers}
                        data={measures_adapted}
//                        appendButtons={toggle_active}
//                        onUpdate={(changed_data) => onToggle(changed_data)}
                    />
                    <SmartTable
                        title="Static Data"
                        header={headers}
                        data={static_data_adapted}
//                        appendButtons={toggle_active}
//                        onUpdate={(changed_data) => onToggle(changed_data)}
                    />
                    <SmartTable
                        title="Losses"
                        header={headers}
                        data={losses_adapted}
//                        appendButtons={toggle_active}
//                        onUpdate={(changed_data) => onToggle(changed_data)}
                    />
                </div>
            )
            return Settings;
        }
        return null;
    }
}

SettingsSources.propTypes = {
    measures: PropTypes.array.isRequired,
    static_data: PropTypes.array.isRequired,
    losses: PropTypes.array.isRequired,
    onToggle: PropTypes.func.isRequired,
    reload: PropTypes.bool,
    lite: PropTypes.bool,
};
