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
            groupSelected: false,
        };
    }

    render() {

        const {aggregations, groupSelected} = this.state;

        const actions = [
            <RaisedButton
              key="deleteButton"
              label='Delete'
              primary={true}
              onTouchTap={(e) => this.deleteProposal(e)}
              disabled={!groupSelected}
            />
        ]


        return  (
            <div>
                <Table
                    fixedHeader={true}
                    selectable={true}
                    multiSelectable={true}
                    onRowSelection={this.handleAggregations}
                >
                    <TableHeader
                        displaySelectAll={false}
                        enableSelectAll={false}
                    >
                      <TableRow>
                          <TableHeaderColumn>Name</TableHeaderColumn>
                          <TableHeaderColumn>DB Fields</TableHeaderColumn>
                      </TableRow>
                    </TableHeader>

                    <TableBody
                        stripedRows={false}
                        deselectOnClickaway={false}
                    >
                {
                    aggregations.map(function(agg, index) {
                        return (
                            <TableRow key={"tableRow_"+index}>
                                <TableRowColumn>{agg.name}</TableRowColumn>
                                <TableRowColumn>
                                    {
                                        agg.db_fields.map(function(field, index){
                                            const separator = (index==0)? "":", ";
                                            return separator + field;
                                        })
                                    }
                                </TableRowColumn>
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
