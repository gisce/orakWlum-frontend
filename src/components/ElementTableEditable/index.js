import React, { Component } from 'react'
import PropTypes from 'prop-types';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import ReactDataGrid from 'react-data-grid';


import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Paper from 'material-ui/Paper';

const styles = {
};

export class ElementTableEditable extends Component {
    constructor(props) {
        super(props)
        this.rows = props.data;
        this.columns = props.header;
    }

    rowGetter = rowNumber => this.rows[rowNumber];

    render() {

        return <ReactDataGrid
          columns={this.columns}
          rowGetter={this.rowGetter}
          rowsCount={this.rows.length}
          enableCellSelect={true}
          minHeight={500}
          onGridRowsUpdated={this.handleGridRowsUpdated}
        />;

    }
}

ElementTableEditable.propTypes = {
    header: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    title: PropTypes.string,
    appendButtons: PropTypes.array,
};
