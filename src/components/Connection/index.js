import React, { Component } from 'react'

import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../actions/orakwlum';

import { socket, socket_connect, dispatchNewRoute } from '../../utils/http_functions';

var NotificationSystem = require('react-notification-system');

function mapStateToProps(state) {
    return {
        token: state.auth.token,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}


//A notification wrapper for react-notification-system
class Notification extends Component {
    createNotification = (the_notification) => {
      this.refs.internalNotificationSystem.addNotification(the_notification);
    }

    render() {
      return (
        <div>
          <NotificationSystem ref="internalNotificationSystem" />
        </div>
        );
    }
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

                let the_message = {
                    title: 'okW Elements',
                    message: content.message,
                }

                //Integrate a "view it" button that redirects to the related URL (if exist)
                if ('url' in content && content.url)
                    the_message.action = {
                        label: 'View it!',
                        callback: (event) => {
                          dispatchNewRoute("/" + content.url, event);
                        }
                    };

                //Set the notification level
                switch (content.code) {
                    case 200:
                        the_message.level = "info";
                        break;

                    case 1:
                        the_message.level = "success";
                        the_message.autoDismiss = 0;
                        break;

                    case -1:
                        the_message.level = "error";
                        the_message.autoDismiss = 0;
                        break;

                    default:
                        the_message.level = "warning";
                        break;
                }

                //Create the notification!
                this.refs.notificationSystem.createNotification(the_message);
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
        return <Notification ref="notificationSystem"/>;
    }
}

Connection.propTypes = {
    token: PropTypes.string,
};
