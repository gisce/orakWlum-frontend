import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/orakwlum';

import { ElementsDashboard } from './ElementsDashboard';

import { LoadingAnimation } from 'materialized-reactions/LoadingAnimation';

import { debug } from '../utils/debug';
import { socket, socket_connect, ask_the_api } from '../utils/http_functions';

function mapStateToProps(state) {
    return {
        token: state.auth.token,

        elements: state.orakwlum.elements,
        message: state.orakwlum.message,
        aggregations: state.orakwlum.aggregations,
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

        this.fetchAllElements();
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
        ask_the_api('aggregations.get');
        ask_the_api('elements.get');
    }

    fetchOneElement(){
        console.debug("updating some elements")
        ask_the_api('element.get');
    }

    render() {
        const {message, elements, aggregations, loaded} = this.props;

        const the_path = this.props.location.pathname;

        // Adapt elements object to array of content of each element
        let the_elements = [];
        for ( let [key, value] of Object.entries(elements)) {
            the_elements.push(value);
        }

        return (
            <div>

            {
                {loaded} &&
                    <p>{message}</p>
            }

                <button
                    onClick={() => this.fetchAllElements()}
                >
                    reFetch elements
                </button>

                <button
                    onClick={() => this.fetchOneElement()}
                >
                    Fetch NEW rand element
                </button>

                <button
                    onClick={() => this.massiveFetchAllElements()}
                >
                    Update ALL with rand
                </button>

                <button
                    onClick={() => this.massiveCleanUp()}
                >
                    Clear ALL instances
                </button>


                {
                    (
                        ( aggregations != null && Object.keys(elements).length > 0) &&

                        ( elements != null)
                    )?

                        <div>
                            <ElementsDashboard
                                title="Last proposals"
                                path={the_path}

                                elements={the_elements}
                                aggregations={aggregations}
                            />
                        </div>

                    :

                        <div>
                            <LoadingAnimation />
                        </div>

                }

                {debug(Object.keys(elements).length)}
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
