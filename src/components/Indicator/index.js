import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress';

//import { updatePaths, toggleName, removeNode, changeOffset } from '../../actions/proposalGraph';

import {colors} from '../../constants';

const styles = {
    paper: {
        height: 150,
        width: 150,
        margin: 20,
        textAlign: 'center',
        display: 'inline-block',
    },
    paperDepth: 4,
};


export class Indicator extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const {title, value} = this.props;

        const is_percentage = (this.props.percentage)?this.props.percentage:false;

        const total = (this.props.total)?parseInt(this.props.total):0;

        const visual_indicator = (is_percentage) && (total>=0) &&
            (
                <div>{total}</div>
            );


        return (
            <Paper key={"invoice_"+title} style={styles.paper} zDepth={styles.paperDepth}>
                <div className="inner">
                  <h3>{title}</h3>
                  <p>{value}</p>
                </div>
                <div className="icon">
                  <i className="ion ion-bag"></i>
                </div>
            </Paper>
        );
    }
}

Indicator.propTypes = {
    title: React.PropTypes.string.isRequired,
    value: React.PropTypes.string.isRequired,
    percentage: React.PropTypes.bool,
    total: React.PropTypes.number,
};
