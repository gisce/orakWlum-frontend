import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/profile';


function mapStateToProps(state) {
    return {
        data: state.profile,
        token: state.auth.token,
        loaded: state.profile.loaded,
        isFetching: state.profile.isFetching,
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
        const userName = this.props.userName;
        this.props.fetchProfile(token, userName);
    }

    render() {
        return (
            <div>
                {!this.props.loaded
                    ? <h1>Loading Profile...</h1>
                    :
                    <div>
                        <h1>Profile</h1>

                        {this.props.data.data.groups}

                        <h3>Debug:</h3>
                        <pre>{ JSON.stringify(this.props.data, null, 2) }</pre>

                    </div>
                }
            </div>
        );
    }
}

ProfileView.propTypes = {
    fetchProtectedDataProposals: React.PropTypes.func,
    fetchProtectedData: React.PropTypes.func,
    loaded: React.PropTypes.bool,
    userName: React.PropTypes.string,
    data: React.PropTypes.any,
    token: React.PropTypes.string,
};
