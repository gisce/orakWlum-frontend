import React, { Component } from 'react'

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

const styles = {
};

export class AggregationsList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            aggregations: props.aggregations,

            //Flag to disable Create action
            disableCreation: false,
            //Flag to disable Edit action
            disableEdit: true,
            //Flag to disable Delete action
            disableDelete: true,

            //The list of index position of the selected elements
            selectedIDs: [],

            //The list IDs of the selected aggregations
            selectedAggregations: [],
        };
    }

    newAggregation(e) {
        e.preventDefault();
        console.log("new");
    }

    editAggregation(e) {
        e.preventDefault();
        console.log("edit", this.state.selectedAggregations);
    }

    deleteAggregation(e) {
        const agg = this.state.selectedAggregations;
        console.log("delete", agg);
    }

    handleSelection(selections) {
        const aggregations = this.state.aggregations;

        let oneSelected, groupSelected, disableCreate, disableEdit, disableDelete;
        let selectedIDs = [];
        let selectedAggregations = [];

        //Reach the selectedAggregations (IDs) and positional lists
        switch( selections ) {
            case "all":
                selectedAggregations, selectedIDs = aggregations.map(function(selected, index) {
                    selectedAggregations.push(selected._id);
                    selectedIDs.push(index);
                });
                break;

            case "none":
                selectedAggregations = [];
                selectedIDs = [];
                break;

            default:
                selections.map(function(selected, index) {
                    selectedAggregations.push(aggregations[selected]._id);
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

        //Disable Delete if all aggregations are selected, or none was selected
        disableDelete = (selection_length == aggregations.length)?true:!(oneSelected || groupSelected);

        this.setState ({
            selectedIDs,
            selectedAggregations,
            disableCreate,
            disableEdit,
            disableDelete,
        })
    }

    render() {
        const {aggregations, selectedIDs, selectedAggregations, disableCreate, disableEdit, disableDelete} = this.state;

        const actions = [
            <RaisedButton
              key="createButton"
              label='New'
              primary={true}
              onTouchTap={(e) => this.newAggregation(e)}
              disabled={disableCreate}
            />
        ,
            <RaisedButton
              key="editButton"
              label='Edit'
              primary={true}
              onTouchTap={(e) => this.editAggregation(e)}
              disabled={disableEdit}
            />
        ,
            <RaisedButton
              key="deleteButton"
              label='Delete'
              primary={true}
              onTouchTap={(e) => this.deleteAggregation(e)}
              disabled={disableDelete}
            />
        ]


        return  (
            <div>
                <Table
                    fixedHeader={true}
                    selectable={true}
                    multiSelectable={true}
                    onRowSelection={(agg) => this.handleSelection(agg)}
                >
                    <TableHeader
                        displaySelectAll={false}
                        enableSelectAll={false}
                    >
                      <TableRow>
                          <TableHeaderColumn>Name</TableHeaderColumn>
                          <TableHeaderColumn>Short name</TableHeaderColumn>
                          <TableHeaderColumn>DB Fields</TableHeaderColumn>
                          <TableHeaderColumn>Status</TableHeaderColumn>
                      </TableRow>
                    </TableHeader>

                    <TableBody
                        stripedRows={true}
                        deselectOnClickaway={false}
                    >
                {
                    aggregations.map(function(agg, index) {
                        let selected = (selectedIDs.indexOf(index) > -1)?true:false;

                        return (
                            <TableRow
                                key={"tableRow_"+index}
                                selected={selected}
                                >
                                <TableRowColumn>{agg.name}</TableRowColumn>
                                <TableRowColumn>{agg.lite}</TableRowColumn>
                                <TableRowColumn>
                                    {
                                        agg.db_fields.map(function(field, index){
                                            const separator = (index==0)? "":", ";
                                            return separator + field;
                                        })
                                    }
                                </TableRowColumn>
                                <TableRowColumn>{agg.status.full}</TableRowColumn>
                            </TableRow>
                        )
                    })
                }
                    </TableBody>
                </Table>

            {
                    this.state.aggregations_error_text &&
                    <div>
                        <TextField
                            id="aggregationError"
                            style={{marginTop: 0}}
                            floatingLabelText=""
                            value=""
                            errorText={this.state.aggregations_error_text}
                        />
                        <br/>
                        <br/>
                    </div>
            }

            {actions}

            </div>
        );
    }
}

AggregationsList.propTypes = {
    aggregations: React.PropTypes.array.isRequired,
};
