import React, { Component } from 'react'

import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../actions/orakwlum';

import { dispatchNewRoute, force_logout } from '../../utils/http_functions';

var NotificationSystem = require('react-notification-system');

var FileSaver = require('../../../node_modules/file-saver/FileSaver.min.js');

import { localized_time } from '../../constants'


function mapStateToProps(state) {
    return {
        sync: state.orakwlum.sync,
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

        const {sync} = this.props;

        this.state = {
            sync,
        }
    }

    prepareNotification (content) {
        if (content && 'message' in content) {
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

        // Preventive clean'up of already set Listeners
        if (window.socket.connected && Object.keys(window.socket._callbacks).length > 0 ) {
            window.socket.removeAllListeners()
        }

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
                // Prepare the attachment just for the requester client
                if (window.socket.id == content.client_id) {
    				console.debug('[Websocket] Exported element received');
                    const file_buffer = Buffer.from(content.result);
                    const file = new Blob( [ file_buffer ]);
                    FileSaver.saveAs(file, content.filename);

                    if (!content.silent) {
                        this.prepareNotification(content, "XLS document exported");
                    }
                }
			})




        ///////////////////
        // MODIFICATIONS //
        ///////////////////

			.on('modifications.extend', (content) => {
				console.debug('[Websocket] Modifications to extend received');
				this.props.reduceModifications(content);

                if (!content.silent) {
                    this.prepareNotification(content, "Modifications updated");
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
				//this.props.overrideMessage(content, initial);

                if (!content.silent) {
                    if (content.clean_all)
                        this.cleanNotifications();

                    this.prepareNotification(content);;
                }
			})



        ////////////////////
        // REDIRECT EVENTS //
        ////////////////////

			.on('redirect', (content) => {
				console.debug('[Websocket] Redirect received');

                if (!content.silent) {
                    if (content.clean_all)
                        this.cleanNotifications();

                    this.prepareNotification(content);;
                }


                setTimeout(() => {
                    if (content.url) {
                        dispatchNewRoute(content.url);
                    }
                }, 5000)

			})



        /////////////
        // PROFILE //
        /////////////

            .on('profile.override', (content) => {
                console.debug('[Websocket] Profile received');
                this.props.overrideProfile(content, initial);

                if (!content.silent) {
                    if (content.clean_all)
                        this.cleanNotifications();

                    this.prepareNotification(content);;
                }
            })



        /////////////
        // PROFILE //
        /////////////

            .on('version.override', (content) => {
                console.debug('[Websocket] Version received');
                this.props.overrideVersion(content, initial);

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
                console.debug('[Websocket] Connected');

                this.cleanNotifications();
                this.prepareNotification({
                    code: 200,
                    title: 'Connected!',
                    message: 'Connection established!',
                });

                const todayDate = localized_time();

                // Fetch the last sync stamp
                let sync = this.state.sync;
                const {last_sync} = sync;

                // Start synchronization and set the new sync date to now
                this.props.synchronizePendingElements(last_sync);
                sync.last_sync = todayDate.unix();
                this.setState({
                    sync,
                })

                console.debug("Synch started between", last_sync, sync.last_sync)
            })

            .on('auth.logout', (content) => {
                console.debug('[Websocket] Enforced logout from the API');
                this.prepareNotification(content);

                setTimeout(() => {
                    dispatchNewRoute("/logout");
                }, 5000)
            })

            .on('disconnect', () => {
                console.debug('[Websocket] Disconnected');

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
                })
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
