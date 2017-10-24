import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

//import { updatePaths, toggleName, removeNode, changeOffset } from '../../actions/proposalGraph';

import {adaptProposalData} from '../../utils/graph';
import {roundUp} from '../../utils/misc';
import {colors} from '../../constants';

const styles = {
    selectedElement: {
        color: 'white',
        backgroundColor: '#808080',
        textAlign: 'center',

    },
    hourColor: {
        color: 'white',
        backgroundColor: '#BBBBBB',
        textAlign: 'right',
    },
    alignCenter: {
        textAlign: 'center',
        textOverflow: '',
    },
    alignLeft: {
        textAlign: 'left',
    },
    alignRight: {
        textAlign: 'right',
    },
    hourColumn: {
    },
    disclamer:{
        textAlign: 'center',
        margin: 5,
    }
};


export class ElementTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const data = this.props.data;
        const components = this.props.components;
        const type = (this.props.type)?this.props.type:null;

        //Add totals by default
        const totals = (typeof this.props.totals !== 'undefined')?this.props.totals:true;

        const disclamer = (typeof this.props.unit != 'undefined' && this.props.unit != null)?<div style={styles.disclamer}><span>*All table entries are <u>{this.props.unit}</u></span></div>:null;

        const howManyComponents = Object.keys(components).length;

        if (howManyComponents > 18) {
            return (
                <div>
                    <br/>
                    <p>
                        Sorry, but <strong>there are too many components to render</strong> using this aggregation, the <strong>table will be un-usable</strong>.
                    </p>

                    <p>
                        Export the Proposal to a spreadsheet, toggle to chart view or select another aggregation to view their table.
                    </p>
                    <br/>
                </div>
            );
        }

        //Prepare the components keys, sorted by name ASC
        const componentsKeys=Object.keys(components).sort();

        //Prepare headers
        const headers = componentsKeys.map(function(component, i) {
                const text_color = (colors[i] == "#000000")?'white':'black';

                return (
                    <TableRowColumn
                        key={"header"+i}
                        style={{backgroundColor: colors[i], color: text_color, textAlign: styles.alignCenter.textAlign }}
                        stroke={colors[i]}
                        fill={colors[i]}
                    >
                        <b>{components[component].title}</b>
                    </TableRowColumn>
                )
        });

        const headerTotal = (totals) && (
            <TableRowColumn
                key={"headerTotal"}
                style={styles.selectedElement}
            >
                <b>TOTAL</b>
            </TableRowColumn>
        );

        const precision = 2;
        //Prepare rows and cells
        let rows=[];

        //The total for each aggregate component
        let allTotalSum = [];
        for (var a=0; a<Object.keys(components).length; a++)
            allTotalSum[a] = 0;

        for (var i=0; i<data.length; i++) {
            let cells=[];
            cells.push(
                <TableRowColumn
                    key={"Column"+i}
                    style={ Object.assign({},styles.hourColor, {width:styles.hourColumn.width})}
                >
                    {data[i].name}
                </TableRowColumn>
            );

            let totalSum = 0;

            componentsKeys.map(function (comp, j) {
                let value = (data[i][comp])?data[i][comp]:0;
                cells.push(
                    <TableRowColumn
                        key={"Column"+i+j}
                        style={styles.alignCenter}
                    >
                        {value}
                    </TableRowColumn>
                );

                //the total for this hour
                totalSum = roundUp(Number(totalSum) + Number(value), precision);

                //the total of this aggr component
                allTotalSum[j] = roundUp(Number(allTotalSum[j]) + Number(value), precision);
            })

            if (totals) {

                // Push the total for this row
                cells.push(
                    <TableRowColumn
                        key={"Column"+i+"TOTAL"}
                        style={ Object.assign({},styles.selectedElement, {textOverflow:styles.alignCenter.textOverflow})}
                    >
                        <b>{totalSum}</b>
                    </TableRowColumn>
                )
            }

            rows.push (
                <TableRow key={"tableRow"+i}>
                    {cells}
                </TableRow>
            );
        }


        if (totals) {
            let totalRow = [];
            let totalSum = 0;

            //Prepare the last row with the TOTALS
            allTotalSum.map( function (component, z) {
                totalRow.push (
                    <TableRowColumn
                        key={"tableRowTotal"+z}
                        style={styles.alignCenter}
                    >
                        {component}
                    </TableRowColumn>
                );
                totalSum += component;
            })

            rows.push (
                <TableRow
                    key={"tableRowTotal"}
                    style={styles.selectedElement}
                    selectable={false}>

                    <TableRowColumn
                        key={"tableRowTotalHeader"}
                        style={styles.alignRight}
                    >
                        <b>TOTAL</b>
                    </TableRowColumn>

                    {totalRow}

                    <TableRowColumn
                        key={"tableRowTotalHeader"}
                        style={styles.alignCenter}
                    >
                        <b>{totalSum}</b>
                    </TableRowColumn>
                </TableRow>
            );
        }

        return (
            <div >
                <Table>
                    <TableHeader
                        displaySelectAll={false}
                        adjustForCheckbox={false}
                        >
                        <TableRow key="headersRow">
                            <TableRowColumn
                                key={"headerHour"}
                                style={ Object.assign({},styles.hourColor, {width:styles.hourColumn.width})}

                            >
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
                {disclamer}
            </div>
        );
    }
}

ElementTable.propTypes = {
    data: PropTypes.array.isRequired,
    components: PropTypes.object.isRequired,
    colors: PropTypes.object,
    type: PropTypes.bool,
    totals: PropTypes.bool,
    unit: PropTypes.string,
};
