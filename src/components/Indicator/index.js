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
    header: {
        fontSize: 25,
        textDecoration: 'underline',
    },
    value: {
        fontSize: 35,
    },
    valueUnit: {
        fontSize: 20,
    },
    subvalue: {
        fontSize: 20,
    },
    normalSize: {
        height: 200,
        width: 200,
    },
    smallSize: {
        height: 260,
        width: 150,
    },
    kingSize: {
        height: 300,
        width: 300,
    },
    indicatorHeader: {
        fontSize: 35,
        fontWeight: 300,
    },
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

        const style_color = (which_color)?
            {
                backgroundColor: which_color,
                color: (which_color == "#000000")?'white':'black',
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

        const {title, value, subvalue} = this.props;
        const value_asInt = parseInt(value);
        const subvalue_asInt = parseInt(subvalue);

        const valueInfo = (this.props.valueInfo)?this.props.valueInfo:null;
        const subvalueInfo = (this.props.subvalueInfo)?this.props.subvalueInfo:null;

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
                        color= {style_color.color}
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


        const has_unit = (value.toString().search(" ")>-1)?true:false;
        const value_list = value.toString().split(" ");

        const hasSubvalue = (subvalue != "" && subvalue != null)

        const separator = (hasSubvalue)?<br/>:null;

        return (
            <Paper key={"invoice_"+title} style={paper_style} zDepth={styles.paperDepth}>
                <div style={{ color: style_color.color }}>
                    <h3 style={styles.header}>{title}</h3>

                    {separator}
                    <span title={valueInfo} style={styles.value}>{value_list[0]}</span> 
                    {
                        (has_unit) &&
                        <span 
                            style={styles.valueUnit}
                        >{value_list[1]}
                        </span>
                    }

                    { 
                        (hasSubvalue) &&
                    <span 
                        title={subvalueInfo}
                        style={styles.subvalue}
                    >
                            <br/>{subvalue}
                    </span>

                    }
                    {separator}
                    {separator}
                    {visual_indicator}
                </div>
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
    subvalue: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number,
    ]),
    valueInfo: React.PropTypes.string,
    subvalueInfo: React.PropTypes.string,
    percentage: React.PropTypes.bool,
    total: React.PropTypes.number,
    small: React.PropTypes.bool,
    color: React.PropTypes.string,
};
