import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress';

//import { updatePaths, toggleName, removeNode, changeOffset } from '../../actions/proposalGraph';

import {colors} from '../../constants';

const styles = {
    selectedElement: {
        color: 'white',
        backgroundColor: '#808080',
    },
    hourColor: {
        color: 'white',
        backgroundColor: '#BBBBBB',
    },
    paper: {
        height: 150,
        width: 150,
        margin: 20,
        textAlign: 'center',
        display: 'inline-block',
    },
    paperDepth: 4,
};


export class ProposalDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const data = this.props.data;

        //open it by default
        const open = (this.props.open)?this.props.open:true;

        //handle invoice types
        const invoice_types = (data.invoice_types) &&
            Object.keys(data.invoice_types).map(function(component, i) {
                const component_name = data.invoice_types[component].name;
                const component_value =  data.invoice_types[component].value;

                return (
                    <Paper key={"invoice_"+component} style={styles.paper} zDepth={styles.paperDepth}>
                        <div className="inner">
                          <h3>{component_name}</h3>
                          <p>{component_value}</p>
                        </div>
                        <div className="icon">
                          <i className="ion ion-bag"></i>
                        </div>
                    </Paper>
                )
            });

        //Prepare headers
        const num_cups = (
            <Paper style={styles.paper} zDepth={styles.paperDepth}>
                <div className="inner">
                  <h3>150</h3>
                  <p>CUPS</p>
                </div>
                <div className="icon">
                  <i className="ion ion-bag"></i>
                </div>
            </Paper>
        );

        return (
            open &&
                <div >
                    {num_cups}

                    {invoice_types}
                </div>
        );
    }
}

ProposalDetail.propTypes = {
    data: React.PropTypes.object.isRequired,
    open: React.PropTypes.bool,
    colors: React.PropTypes.object,
};
