import React, {Component} from 'react'
import PropTypes from 'prop-types';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import ReactDataGrid from 'react-data-grid';

import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn
} from 'material-ui/Table';
import Paper from 'material-ui/Paper';

const styles = {};

export class ElementTableEditable extends Component {
    constructor(props) {
        super(props)
        this.originalRows = props.data;
        this.rows = props.data;
        this.columns = props.header;
    }

    handleGridSort = (sortColumn, sortDirection) => {
        console.debug(sortDirection);

        const comparer = (a, b) => {
            if (sortDirection === 'ASC') {
                return (a[sortColumn] > b[sortColumn])
                    ? 1
                    : -1;
            } else if (sortDirection === 'DESC') {
                return (a[sortColumn] < b[sortColumn])
                    ? 1
                    : -1;
            }
        };

        this.rows = sortDirection === 'NONE'
            ? this.originalRows.slice(0)
            : this.rows.sort(comparer);
    }

    rowGetter = rowNumber => this.rows[rowNumber];

    handleUpdate = (changes) => {
        const {fromRow, toRow, updated} = changes;
        const updated_field = Object.keys(updated)[0]

        let difference = {}
        for (let i = fromRow; i <= toRow; i++) {
            //let rowToUpdate = this.rows[i];
            //let updatedRow = React.addons.update(rowToUpdate, {$merge: updated});

            difference[i] = updated[updated_field] - this.rows[i][updated_field]

            // merge with the change
            this.rows[i] = {
                ...this.rows[i],
                ...updated
            };
        }
        this.props.parentDataHandler(updated_field, difference);
    }

    render() {
        return (<ReactDataGrid columns={this.columns} rowGetter={this.rowGetter} rowsCount={this.rows.length} enableCellSelect={true} minHeight={500} onGridRowsUpdated={this.handleUpdate} onGridSort={this.handleGridSort}/>);

    }
}

ElementTableEditable.propTypes = {
    header: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    title: PropTypes.string,
    appendButtons: PropTypes.array,
    parentDataHandler: PropTypes.func
};
