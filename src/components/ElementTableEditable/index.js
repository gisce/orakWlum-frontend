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
        this.originalRows = props.data;
        this.rows = props.data;
        this.columns = props.header;
    }

    handleGridSort = (sortColumn, sortDirection) => {
      const comparer = (a, b) => {
        if (sortDirection === 'ASC') {
          return (a[sortColumn] > b[sortColumn]) ? 1 : -1;
        } else if (sortDirection === 'DESC') {
          return (a[sortColumn] < b[sortColumn]) ? 1 : -1;
        }
      };

      this.rows = sortDirection === 'NONE' ? this.rows.originalRows.slice(0) : this.rows.sort(comparer);
    }

    rowGetter = rowNumber => this.rows[rowNumber];

    update = (fromRow, toRow, updated) => console.log(fromRow, toRow, updated);

    render() {

        return <ReactDataGrid
          columns={this.columns}
          rowGetter={this.rowGetter}
          rowsCount={this.rows.length}
          enableCellSelect={true}
          minHeight={500}
          onGridRowsUpdated={this.update}
          onGridSort={this.handleGridSort}
        />;

    }
}

ElementTableEditable.propTypes = {
    header: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    title: PropTypes.string,
    appendButtons: PropTypes.array,
};
