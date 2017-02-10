import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Paper from 'material-ui/Paper';

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

        //Prepare headers
        const num_cups = (
            <div>
                <Paper style={styles.paper} zDepth={styles.paperDepth}>
                    <div class="inner">
                      <h3>150</h3>
                      <p>CUPS</p>
                    </div>
                    <div class="icon">
                      <i class="ion ion-bag"></i>
                    </div>
                </Paper>

            </div>
        );

        return (
            open &&
                <div >
                    {num_cups}
                </div>
        );
    }
}

ProposalDetail.propTypes = {
    data: React.PropTypes.array.isRequired,
    open: React.PropTypes.bool,
    colors: React.PropTypes.object,
};
