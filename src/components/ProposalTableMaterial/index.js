import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

//import { updatePaths, toggleName, removeNode, changeOffset } from '../../actions/proposalGraph';

import {adaptProposalData} from '../../utils/graph';

const styles = {
    dialog: {
        width: '80%',
        maxWidth: 'none',
    },
    graphContainer: {
        maxWidth: '500px',
        maxHeight: '200px',
    }

};

const colors = [
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
        const prediction = this.props.proposal.prediction;
        const type = (this.props.type)?this.props.type:null;

        const height = (this.props.height)?this.props.height:500;
        const width = (this.props.width)?this.props.width:1024;

        //Adapt proposal data (transpose data to days and columns dimension)
        const data=adaptProposalData(prediction);

        //Prepare headers
        const headers = prediction.map(function(day, i) {
            return (
                <TableRowColumn key={"header"+i} stroke={colors[i]} fill={colors[i]}>
                    <b>{day.day}</b>
                </TableRowColumn>
            )
        });

        //Prepare rows and cells
        let rows=[];
        for (var i=0; i<data.length; i++) {
            let cells=[];
            cells.push(
                <TableRowColumn key={"Column"+i}>
                    {data[i].name}
                </TableRowColumn>
            );
            for (var j=0; j<prediction.length; j++) {
                cells.push(
                    <TableRowColumn key={"Column"+i+j}>
                        {data[i][prediction[j].day]}
                    </TableRowColumn>
                );
            }

            rows.push (
                <TableRow key={"tableRow"+i}>
                    {cells}
                </TableRow>
            );
        }

        return (
            <div >
                <Table>
                    <TableHeader displaySelectAll={false}>
                        <TableRow key="headersRow">
                            <TableRowColumn key={"headerHour"}>
                                <b>Hour</b>
                            </TableRowColumn>

                            {headers}
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
    proposal: React.PropTypes.object.isRequired,
    type: React.PropTypes.bool,
    isLite: React.PropTypes.bool,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
};
