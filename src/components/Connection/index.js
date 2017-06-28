import React, { Component } from 'react'

import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../actions/orakwlum';

import { dispatchNewRoute } from '../../utils/http_functions';

var NotificationSystem = require('react-notification-system');

var FileSaver = require('../../../node_modules/file-saver/FileSaver.min.js');

function mapStateToProps(state) {
    return {
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

//The Connection component that handles the Websocket and the related main listeners
@connect(mapStateToProps, mapDispatchToProps)
export class Connection extends Component {
    constructor(props) {
        super(props)
        this._notificationSystem = null;
    }

    prepareNotification (content) {
        //Initialize a new message based on the provided one
        let the_message = {
            ...{},
            ...content,
        }

        //Integrate a "view it" button that redirects to the related URL (if exist)
        if ('url' in content && content.url)
            the_message.action = {
                label: 'View it!',
                callback: (event) => {
                  dispatchNewRoute(content.url, event);
                }
            };

        //Set notification level based on the code if not provided
        if (!('level' in content)) {
            switch (content.code) {
                case 200:
                    console.log("entro");
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
        }

        //Create the notification!
        this._notificationSystem.addNotification(the_message);
    }

    //Clean pending notifications
    cleanNotifications() {
        this._notificationSystem.clearNotifications();
    }

    componentDidMount() {
        //Bind ref when component is mounted
        this._notificationSystem = this.refs.internalNotificationSystem;
    }

	componentWillMount() {
        //initialize the connection
		const initial=true;

		//listen events!
		window.socket

        //////////////
        // ELEMENTS //
        //////////////

			.on('elements.override', (content) => {
				console.debug('[Websocket] Elements to override received');
				this.props.overrideElements(content, initial);

                if (!content.silent) {
                    this.prepareNotification(content, "Elements overrided");
                }

			})

			.on('elements.extend', (content) => {
				console.debug('[Websocket] Elements to extend received');
				this.props.extendElements(content, initial);

                if (!content.silent) {
                    this.prepareNotification(content, "Elements updated");;
                }
			})

			.on('elements.extend.virtual', (content) => {
				console.debug('[Websocket] Volatile Elements to extend received');
				this.props.extendElementsVolatile(content, initial);

                if (!content.silent) {
                    this.prepareNotification(content, "Elements updated");;
                }
			})

			.on('elements.file', (content) => {
				console.debug('[Websocket] Exported element received');

                const file_buffer = Buffer.from(content.result);
                const file = new Blob( [ file_buffer ]);
                FileSaver.saveAs(file, content.filename);

                if (!content.silent) {
                    this.prepareNotification(content, "XLS document exported");;
                }
			})



        //////////////////
        // AGGREGATIONS //
        //////////////////

			.on('aggregations', (content) => {
				console.debug('[Websocket] Aggregations received');
				this.props.overrideAggregations(content, initial);
			})



        ////////////////////
        // MESSAGE EVENTS //
        ////////////////////

			.on('message', (content) => {
				console.debug('[Websocket] Message received');
				this.props.overrideMessage(content, initial);

                if (!content.silent) {
                    if (content.clean_all)
                        this.cleanNotifications();

                    this.prepareNotification(content);;
                }
			})



        //////////////
        // SETTINGS //
        //////////////

        .on('sources.override', (content) => {
            console.debug('[Websocket] Sources received');
            this.props.overrideSources(content, initial);

            if (!content.silent) {
                if (content.clean_all)
                    this.cleanNotifications();

                this.prepareNotification(content);;
            }
        })



        ////////////////////
        // CONNECT EVENTS //
        ////////////////////

            .on('connect', () => {
                console.debug('Connected');

                this.cleanNotifications();
                this.prepareNotification({
                    code: 200,
                    title: 'Connected!',
                    message: 'Connection established!',
                });
            })

            .on('disconnect', () => {
                console.debug('Disconnected');

                this.cleanNotifications();

                this.prepareNotification({
                    title: 'Offline mode',
                    message: "okW is in offline mode",
                    code: 200,
                    autoDismiss: 0,
                    level: "warning",
                    dismissible: false,
                });

                this.prepareNotification({
                    code: -1,
                    title: 'Disconnected',
                    message: 'Can\'t reach the server',
                    level: "error",
                });


            })
	}

    render() {
        //Activate Offline mode if needed
        setTimeout(() => {
            if (!window.socket.connected) {
                this.prepareNotification({
                    title: 'Offline mode',
                    message: "okW is in offline mode",
                    code: 200,
                    autoDismiss: 0,
                    level: "warning",
                    dismissible: false,
                });
            }
        }, 1000)

        return <NotificationSystem ref="internalNotificationSystem" />
    }
}

Connection.propTypes = {
};
