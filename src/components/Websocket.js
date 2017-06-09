import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/profile';

import { UserProfile } from './UserProfile';

import { LoadingAnimation } from 'materialized-reactions/LoadingAnimation';

import { debug } from '../utils/debug';
import { socket } from '../utils/http_functions';

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

        socket.on('connect', function () {
            console.log('Connected!');
            socket.emit('connected');
        });

        socket.on('message', function (content) {
            console.log('message received:', content);
        });
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        //const token = this.props.token;
        //const userName = this.props.userName;
        //this.props.fetchProfile(token);
    }

    sendData(){
        console.log("click")
        socket.emit('okw', "Clicked!");
    }

    updateData(data) {
        const token = this.props.token;
        this.props.updateProfile(token, data);
    }

    render() {
        return (
            <div>
                <p>nooorlll</p>

                <button
                    onClick={() => this.sendData()}
                >
                    bla
                </button>
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
