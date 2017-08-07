import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/orakwlum';

import { UserProfile } from './UserProfile';

import { debug } from '../utils/debug';

import { Notification } from './Notification';

import { PRDetail } from './PRDetail';

import { LoadingAnimation } from 'materialized-reactions/LoadingAnimation';

function mapStateToProps(state) {
    return {
        about: state.orakwlum.version,
        auth: state.auth,
        //loaded: state.about.loaded,
        //message_text: state.about.message_text,
        //message_open: state.about.message_open,
        //error: state.about.error,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export default class ProfileView extends React.Component {
    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        const silent = true;
        this.props.fetchVersion(silent);
    }

    render() {
        const version = this.props.auth.version;
        const version_pr = this.props.auth.version_pr;

        const {about} = this.props;
        let the_version

        if (about && Object.keys(about).length > 0) {
            console.log("entroooooo")
            const {api, frontend} = this.props.about;

            the_version = (
                <div>
                    {
                        (Object.keys(api).length > 0 && Object.keys(frontend).length > 0) ?
                            <div>
                                <br/>

                                <p>oraKWlum suite was created by <a target="_blank" href="http://gisce.net">GISCE</a>.</p>
                                <p>It provides a tool desired to support and speed up the energy provisioning process.</p>

                                <br/>

                                {(frontend) &&
                                    <PRDetail PR={frontend} title="Frontend" />

                                }
                                <br/><br/>

                                {(api) &&
                                    <PRDetail PR={api} title="API"/>
                                }


                            </div>
                        :
                            <div>
                                <Notification
                                    message={this.props.about.message_text}
                                    open={this.props.about.message_open}
                                />
                                <p>There was an error fetching the current version details.</p>
                            </div>



                    }

                    {debug(this.props.about)}
                </div>
            );

        } else {
            the_version = <LoadingAnimation />
        }

        return (
            <div>
                <h1>About oraKWlum</h1>
                {the_version}
            </div>
        )
    }
}

ProfileView.propTypes = {
    fetchVersion: PropTypes.func,
};
