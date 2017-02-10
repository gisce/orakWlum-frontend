import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress';

//import { updatePaths, toggleName, removeNode, changeOffset } from '../../actions/proposalGraph';

import {colors} from '../../constants';

const styles = {
    paper: {
        height: 200,
        width: 200,
        margin: 20,
        textAlign: 'center',
        display: 'inline-block',
    },
    paperDepth: 4,
    fixedSize: {
        height: 80,
        textAlign: 'center',
        overflow:'auto',
    }
};


export class Indicator extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const {title, value} = this.props;
        const value_asInt = parseInt(value);

        const is_percentage = (this.props.percentage)?this.props.percentage:false;

        const total = (this.props.total)?parseInt(this.props.total):0;


/*        <CircularProgress
          mode="determinate"
          value={parseInt(value)}
          max={total}
          size={80}
          thickness={7}
        />

    */
        const visual_indicator = (is_percentage) && (total>=0) ?
            (
                <div style={styles.fixedSize}>
                    <CircularProgress
                              mode="determinate"
                              value={value_asInt}
                              max={total}
                              size={50}
                              thickness={7}
                    />
                    <br/>{(value_asInt/total)*100}%
                </div>
            )
            :
            (
                <div style={styles.fixedSize}>
                </div>
            )

            ;


        return (
            <Paper key={"invoice_"+title} style={styles.paper} zDepth={styles.paperDepth}>
                <h3>{title}</h3>
                <p>{value}</p>
                {visual_indicator}
            </Paper>
        );
    }
}

Indicator.propTypes = {
    title: React.PropTypes.string.isRequired,
    value: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number,
    ]).isRequired,
    percentage: React.PropTypes.bool,
    total: React.PropTypes.number,
};
