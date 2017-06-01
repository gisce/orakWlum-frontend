import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {GridList, GridTile} from 'material-ui/GridList';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';

import * as actionCreators from '../../actions/proposals';

import { ProposalTag } from '../ProposalTag';
import { ProposalGraph } from '../ProposalGraph';

import { dispatchNewRoute} from '../../utils/http_functions';

const styles = {
};

function mapStateToProps(state) {
    return {
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export class ElementsDashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    render() {

        const {elements, aggregations} = this.props;

        console.log(elements);

        console.log(aggregations);


        return null;
    }
}

ElementsDashboard.propTypes = {
    elements: React.PropTypes.array.isRequired,
    aggregations: React.PropTypes.object.isRequired,

};
