import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress';

//import { updatePaths, toggleName, removeNode, changeOffset } from '../../actions/proposalGraph';

import {colors} from '../../constants';

const styles = {
    paper: {
        margin: 20,
        textAlign: 'center',
        display: 'inline-block',
    },
    paperDepth: 4,
    fixedSize: {
        paddingTop:10,
        height: 80,
        textAlign: 'center',
        overflow:'auto',
    },
    value: {
        fontSize: 35,
    },
    header: {
        fontSize: 22,
    },
    normalSize: {
        height: 200,
        width: 200,
    },
    smallSize: {
        height: 200,
        width: 100,
    },
    kingSize: {
        height: 300,
        width: 300,
    }
};


export class Indicator extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const is_small = (this.props.small)?this.props.small:false;

        const which_size = (is_small)? styles.smallSize : styles.normalSize;

        const which_color = (this.props.color)? this.props.color : false;

        const style_background_color = (which_color)?
            {
                backgroundColor: which_color,
                color: 'black',
            }
        :
            {
            }
        ;


        const paper_style = Object.assign({
            height: which_size.height,
            width: which_size.width,
            backgroundColor: which_color,
        }, styles.paper);

        const {title, value} = this.props;
        const value_asInt = parseInt(value);

        const is_percentage = (this.props.percentage)?this.props.percentage:false;
        const total = (this.props.total)?parseInt(this.props.total):0;

        const icon = (this.props.icon)?this.props.icon:false;

        const visual_indicator = (is_percentage) && (total>=0) ?
            (
                <div style={styles.fixedSize}>
                    <CircularProgress
                        mode="determinate"
                        value={value_asInt}
                        max={total}
                        size={50}
                        thickness={7}
                        color= {style_background_color.color}
                    />
                <br/>
                {((value_asInt/total)*100).toFixed(1)}%
                </div>
            )
            :
            (
                <div style={styles.fixedSize}>
                    {icon}
                </div>
            )

            ;





        return (
            <Paper key={"invoice_"+title} style={paper_style} zDepth={styles.paperDepth}>
                <h3 style={styles.header}>{title}</h3>
                <span style={styles.value}>{value}</span>
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
    small: React.PropTypes.bool,
    color: React.PropTypes.string,
};
