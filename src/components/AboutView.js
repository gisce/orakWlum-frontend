import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/about';

import { UserProfile } from './UserProfile';

import { debug } from '../utils/debug';

import { Notification } from './Notification';

import { PRDetail } from './PRDetail';

function mapStateToProps(state) {
    return {
        about: state.about,
        loaded: state.about.loaded,
        profile: state.profile,
        auth: state.auth,
        message_text: state.about.message_text,
        message_open: state.about.message_open,
        error: state.about.error,
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
        const token = this.props.token;
        this.props.fetchVersion(token);
    }

    updateData(data) {
        const token = this.props.token;
        this.props.updateProfile(token, data);
    }

    render() {
        const version = this.props.auth.version;
        const version_pr = this.props.auth.version_pr;

        const api = this.props.about.api;
        const frontend = this.props.about.frontend;

        return (
            <div>

                {

                    (this.props.loaded) ?
                        <div>
                            <h1>About oraKWlum</h1>

                            {(frontend)?
                                <PRDetail PR={frontend} title="Frontend" />
                                :
                                <div>Frontend info not available</div>
                            }

                            {(api)?
                                <PRDetail PR={api} title="API"/>
                                :
                                <div>API info not available</div>
                            }


                        </div>
                    :
                    (this.props.error) &&
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
    }
}

ProfileView.propTypes = {
    fetchVersion: React.PropTypes.func,
    loaded: React.PropTypes.bool,
    data: React.PropTypes.any,
    token: React.PropTypes.string,
};
