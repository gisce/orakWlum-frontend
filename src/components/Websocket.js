import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/profile';

import { UserProfile } from './UserProfile';

import { LoadingAnimation } from 'materialized-reactions/LoadingAnimation';

import { debug } from '../utils/debug';
import { socket, socket_connect } from '../utils/http_functions';

function mapStateToProps(state) {
    return {
        data: state.profile,
        token: state.auth.token,
        loaded: state.profile.loaded,
        isFetching: state.profile.isFetching,
        error: state.profile.error,
        errorMessage: state.profile.data,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}


@connect(mapStateToProps, mapDispatchToProps)
export default class Websocket extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            message: "rolf",
        };


    }

    componentDidMount() {
        this.fetchData();

        socket_connect( "this.state.token" );

        socket.on('message', (content) => {
            console.debug('[Websocket] Message received');
            this.receive_message(content);
        });
    }

    receive_message(content) {
        console.log(content)
        const the_content = content;
        //const the_content = JSON.parse("" + content)

        this.setState ( {
            message: the_content.message,
            response: the_content.response,
            status: the_content.status,
        })
    }

    testRoom(){
        socket.emit('room.test')
    }

    fetchDataa() {
        //const token = this.props.token;
        //const userName = this.props.userName;
        //this.props.fetchProfile(token);
    }

    forceUpdateData(){
        console.log("update")
        socket.emit('room.update', "users");
    }

    fetchData(){
        console.log("fetch")
        socket.emit('elements.get', "fetch");
    }

    updateData(data) {
        const token = this.props.token;
        this.props.updateProfile(token, data);
    }

    render() {
        return (
            <div>
                <p>{this.state.message}</p>

                <button
                    onClick={() => this.fetchData()}
                >
                    Fetch Data
                </button>

                <button
                    onClick={() => this.forceUpdateData()}
                >
                    Update all instances
                </button>

                <button
                    onClick={() => this.testRoom()}
                >
                    Clean all instances
                </button>


                {debug(this.state.response)}
            </div>
        );
    }
}

Websocket.propTypes = {
    loaded: PropTypes.bool,
    userName: PropTypes.string,
    data: PropTypes.any,
    token: PropTypes.string,
};
