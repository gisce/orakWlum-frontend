import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

//import { updatePaths, toggleName, removeNode, changeOffset } from '../../actions/proposalGraph';

import {adaptProposalData} from '../../utils/graph';

const styles = {
    selectedElement: {
        color: 'white',
        backgroundColor: '#808080',
    }
};

const baseColors = [
    '#db4939',
    '#f29913',
    '#3c8cba',
    '#00a658'
]

export class ProposalTableMaterial extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const data = this.props.data;
        const components = this.props.components;
        const type = (this.props.type)?this.props.type:null;

        //Prepare headers
        const headers = Object.keys(components).map(function(component, i) {
            return (
                <TableRowColumn key={"header"+i} stroke={baseColors[i]} fill={baseColors[i]}>
                    <b>{component}</b>
                </TableRowColumn>
            )
        });

        const headerTotal = (
            <TableRowColumn key={"headerTotal"}>
                <b>TOTAL</b>
            </TableRowColumn>
        );

        //Prepare rows and cells
        let rows=[];

        //The total for each aggregate component
        let allTotalSum = [];
        for (var a=0; a<Object.keys(components).length; a++)
            allTotalSum[a] = 0;

        const componentsKeys=Object.keys(components);
        for (var i=0; i<data.length; i++) {
            let cells=[];
            cells.push(
                <TableRowColumn key={"Column"+i}>
                    {data[i].name}
                </TableRowColumn>
            );

            let totalSum = 0;
            componentsKeys.map(function (comp, j) {
                let value = (data[i][comp])?data[i][comp]:0;
                cells.push(
                    <TableRowColumn key={"Column"+i+j}>
                        {value}
                    </TableRowColumn>
                );

                //the total for this hour
                totalSum += value;

                //the total of this aggr component
                allTotalSum[j] += value;
            })

            // Push the total for this row
            cells.push(
                <TableRowColumn
                    key={"Column"+i+"TOTAL"}
                >
                    <b>{totalSum}</b>
                </TableRowColumn>
            )

            rows.push (
                <TableRow key={"tableRow"+i}>
                    {cells}
                </TableRow>
            );
        }

        let totalRow = [];
        let totalSum = 0;
        //Prepare the last row with the TOTALS
        allTotalSum.map( function (component, z) {
            totalRow.push (
                <TableRowColumn key={"tableRowTotal"+z}>
                    <b>{component}</b>
                </TableRowColumn>
            );
            totalSum += component;
        })

        rows.push (
            <TableRow
                key={"tableRowTotal"}
                style={styles.selectedElement}
                selectable={false}>
                <TableRowColumn key={"tableRowTotalHeader"}>
                    <b>TOTAL</b>
                </TableRowColumn>

                {totalRow}

                <TableRowColumn key={"tableRowTotalHeader"}>
                    <b>{totalSum}</b>
                </TableRowColumn>
            </TableRow>
        );

        return (
            <div >
                <Table>
                    <TableHeader
                        displaySelectAll={false}
                        adjustForCheckbox={false}
                        >
                        <TableRow key="headersRow">
                            <TableRowColumn key={"headerHour"}>
                                <b>Hour</b>
                            </TableRowColumn>
                            {headers}
                            {headerTotal}
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                        {rows}
                    </TableBody>
                </Table>
            </div>
        );
    }
}

ProposalTableMaterial.propTypes = {
    data: React.PropTypes.array.isRequired,
    components: React.PropTypes.object.isRequired,
    colors: React.PropTypes.object,
    type: React.PropTypes.bool,
};
