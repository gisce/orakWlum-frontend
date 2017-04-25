import React, { Component } from 'react'

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Paper from 'material-ui/Paper';

const styles = {
};

export class SettingsTable extends Component {

    constructor(props) {
        super(props);

        this.state = {
            table: props.data,

            //Flag to disable Create action
            disableCreation: false,
            //Flag to disable Edit action
            disableEdit: true,
            //Flag to disable Delete action
            disableDelete: true,

            //The list of index position of the selected elements
            selectedIDs: [],

            //The list IDs of the selected entry
            selectedEntrys: [],
        };
    }

    newEntry(e) {
        e.preventDefault();
        console.log("new");
    }

    editEntry(e) {
        e.preventDefault();
        console.log("edit", this.state.selectedEntrys);
    }

    deleteEntry(e) {
        const entry = this.state.selectedEntrys;
        console.log("delete", entry);
    }

    handleSelection(selections) {
        const table = this.state.table;

        let oneSelected, groupSelected, disableCreate, disableEdit, disableDelete;
        let selectedIDs = [];
        let selectedEntrys = [];

        //Reach the selectedEntrys (IDs) and positional lists
        switch( selections ) {
            case "all":
                selectedEntrys, selectedIDs = table.map(function(selected, index) {
                    selectedEntrys.push(selected._id);
                    selectedIDs.push(index);
                });
                break;

            case "none":
                selectedEntrys = [];
                selectedIDs = [];
                break;

            default:
                selections.map(function(selected, index) {
                    selectedEntrys.push(table[selected]._id);
                    selectedIDs.push(selected);
                });
                break;
        };

        const selection_length = selectedIDs.length;

        //Establish if there are one, more than one or none selected.
        switch( selection_length ) {
            case 0:
                oneSelected = false;
                groupSelected = false;
            break;

            case 1:
                oneSelected = true;
                groupSelected = false;
            break;

            default:
                oneSelected = false;
                groupSelected = true;
            break;
        }

        //Activate Creation ever
        disableCreate = false;

        //Activate Selection if just one element is selected
        disableEdit = !oneSelected;

        //Disable Delete if all entry are selected, or none was selected
        disableDelete = (selection_length == table.length)?true:!(oneSelected || groupSelected);

        this.setState ({
            selectedIDs,
            selectedEntrys,
            disableCreate,
            disableEdit,
            disableDelete,
        })
    }

    render() {
        const {selectedIDs, selectedEntrys, disableCreate, disableEdit, disableDelete} = this.state;

        const table = this.props.data;

        const actions = [
            <RaisedButton
              key="createButton"
              label='New'
              primary={true}
              onTouchTap={(e) => this.newEntry(e)}
              disabled={disableCreate}
            />
        ,
            <RaisedButton
              key="editButton"
              label='Edit'
              primary={true}
              onTouchTap={(e) => this.editEntry(e)}
              disabled={disableEdit}
            />
        ,
            <RaisedButton
              key="deleteButton"
              label='Delete'
              primary={true}
              onTouchTap={(e) => this.deleteEntry(e)}
              disabled={disableDelete}
            />
        ]

        return  (
            <Paper>

            {
                (this.props.title) &&
                    <h3>{this.props.title}</h3>
            }

                <Table
                    fixedHeader={true}
                    selectable={true}
                    multiSelectable={true}
                    onRowSelection={(entry) => this.handleSelection(entry)}
                >
                    <TableHeader
                        displaySelectAll={true}
                        enableSelectAll={true}
                    >
                      <TableRow>
                          <TableHeaderColumn>Name</TableHeaderColumn>
                          <TableHeaderColumn>Alias</TableHeaderColumn>
                          <TableHeaderColumn style={{width:'10%'}}>Type</TableHeaderColumn>
                          <TableHeaderColumn style={{width:'10%'}}>Unit</TableHeaderColumn>
                          <TableHeaderColumn style={{width:'30%'}}>DB</TableHeaderColumn>
                          <TableHeaderColumn>Status</TableHeaderColumn>
                      </TableRow>
                    </TableHeader>

                    <TableBody
                        stripedRows={true}
                        deselectOnClickaway={false}
                    >
                {
                    table.map(function(entry, index) {
                        let selected = (selectedIDs.indexOf(index) > -1)?true:false;

                        const active = (entry.active)?"Active":"Deactivated";

                        const db_fields = entry.config[0] + ":" + entry.config[1] + "@" + entry.config[2] + "/" + entry.config[3];

                        return (
                            <TableRow
                                key={"tableRow_"+index}
                                selected={selected}
                                >
                                <TableRowColumn>{entry.name}</TableRowColumn>
                                <TableRowColumn>{entry.alias}</TableRowColumn>
                                <TableRowColumn style={{width:'10%'}}>{entry.type}</TableRowColumn>
                                <TableRowColumn style={{width:'10%'}}>{entry.unit}</TableRowColumn>
                                <TableRowColumn style={{width:'30%'}}>{db_fields}</TableRowColumn>
                                <TableRowColumn>{active}</TableRowColumn>
                            </TableRow>
                        )
                    })
                }
                    </TableBody>
                </Table>

            {
                    this.state.entry_error_text &&
                    <div>
                        <TextField
                            id="entryregationError"
                            style={{marginTop: 0}}
                            floatingLabelText=""
                            value=""
                            errorText={this.state.entry_error_text}
                        />
                        <br/>
                        <br/>
                    </div>
            }

            {actions}

            </Paper>
        );
    }
}

SettingsTable.propTypes = {
    data: React.PropTypes.array.isRequired,
    title: React.PropTypes.string,
};
