import React, { Component } from 'react'

import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../actions/orakwlum';

import { socket, socket_connect } from '../../utils/http_functions';


function mapStateToProps(state) {
    return {
        token: state.auth.token,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}


@connect(mapStateToProps, mapDispatchToProps)
export class Connection extends Component {
	componentWillMount() {

        //initialize the connection
        const token = this.props.token;
        socket_connect("token29832382938298asda29");

		const initial=true;

		//listen events!
		socket
			.on('elements.override', (content) => {
				console.debug('[Websocket] Elements to override received');
				this.props.overrideElements(content, initial);
			})

			.on('elements.extend', (content) => {
				console.debug('[Websocket] Elements to extend received');
				this.props.extendElements(content, initial);
			})

			.on('aggregations', (content) => {
				console.debug('[Websocket] Aggregations received');
				this.props.overrideAggregations(content, initial);
			})

			.on('message', (content) => {
				console.debug('[Websocket] Message received');
				this.props.overrideMessage(content, initial);
			});

	}
    render() {
        return null;
    }
}

Connection.propTypes = {
    token: PropTypes.string,
};
