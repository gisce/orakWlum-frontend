import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../actions/notification';

import Snackbar from 'material-ui/Snackbar';

function handleRequestDelete() {
    alert('Treure TAG.');
}

function handleTouchTap() {
    alert('Filtrar per aquest TAG.');
}

const styles = {
    wrapper: {
      display: 'flex',
      flexWrap: 'wrap',
    },
};

function mapStateToProps(state) {
    return {
        profile: state.profile,
        statusText: state.profile.statusText,
        statusType: state.profile.statusType,
        status: state.profile.status,
        message_open: state.profile.message_open,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export class Notification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profile: props.profile,
            editing: false,
            bckp_profile: JSON.parse(JSON.stringify(props.profile)),
            groups: props.profile.data.groups,
            bckp_groups: Object.assign([], props.profile.data.groups),
        };
    }

    activateSnack = () => {
        this.setState({
            message_open: true,
        });
    };

    undoChanges = () => {
        this.setState({
            message_open: false,
        });
        alert('Undo changes!!!.');
    };

    deactivateSnack = () => {
        this.setState({
            message_open: false,
        });
    };


    render() {
        const message_open = this.state.message_open;

        const Snackbar = () => (

            <div>
            {
                this.props.statusText &&
                        <Snackbar
                          open={this.state.message_open}
                          message={this.props.statusText}
                          action="undo"
                          autoHideDuration={4000}
                          onActionTouchTap={this.undoChanges}
                          onRequestClose={this.deactivateSnack}
                        />
            }
            </div>
        );

        return (
            <Snackbar />
        );
    }
}

Notification.propTypes = {
};
