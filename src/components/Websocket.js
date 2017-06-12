import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/orakwlum';

import { UserProfile } from './UserProfile';

import { LoadingAnimation } from 'materialized-reactions/LoadingAnimation';

import { debug } from '../utils/debug';
import { socket, socket_connect, ask_the_api } from '../utils/http_functions';

function mapStateToProps(state) {
    return {
        data: state.profile,
        token: state.auth.token,
        loaded: state.profile.loaded,
        isFetching: state.profile.isFetching,
        error: state.profile.error,
        errorMessage: state.profile.data,

        elements: state.orakwlum.elements,
        message: state.orakwlum.message,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}


@connect(mapStateToProps, mapDispatchToProps)
export default class Websocket extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        //initialize the connection
        const token = this.props.token;
        socket_connect("token29832382938298asda29");

        const initial=true;

        //listen events!
        socket
            .on('elements', (content) => {
                console.debug('[Websocket] Elements received');
                this.props.overrideElements(content, initial);
            })

            .on('element', (content) => {
                console.debug('[Websocket] Element received');
                this.props.extendElements(content, initial);
            })

            .on('message', (content) => {
                console.debug('[Websocket] Message received');
                this.props.overrideMessage(content, initial);
            });

    }

    massiveCleanUp(){
        console.debug("massive cleaning all elements")
        ask_the_api('all_users.elements.cleanup', "users")
    }

    massiveFetchAllElements(){
        console.debug("massive fetch all elements")
        ask_the_api('all_users.elements.update', "users");
    }

    fetchAllElements(){
        console.debug("fetching all elements")
        ask_the_api('elements.get');
    }

    fetchOneElement(){
        console.debug("updating some elements")
        ask_the_api('element.get');
    }

    render() {
        const {message, elements, loaded} = this.props;

        return (
            <div>

            {
                {loaded} &&
                    <p>{message}</p>
            }

                <button
                    onClick={() => this.fetchAllElements()}
                >
                    Fetch All element
                </button>

                <button
                    onClick={() => this.fetchOneElement()}
                >
                    Update one element
                </button>

                <button
                    onClick={() => this.massiveFetchAllElements()}
                >
                    Update all instances
                </button>

                <button
                    onClick={() => this.massiveCleanUp()}
                >
                    Clean all instances
                </button>

                {debug(elements)}
            </div>
        );
    }
}

Websocket.propTypes = {
    loaded: PropTypes.bool,
    message: PropTypes.string,
    elements: PropTypes.object,
    token: PropTypes.string,
};
