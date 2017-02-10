import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

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
    }
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
                asasd
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
