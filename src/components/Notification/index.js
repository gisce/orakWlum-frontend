import React, { Component } from 'react';

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

export class Notification extends Component {
/*
    constructor(props) {
        super(props);
        this.state = {
            message: props.message,
            open: props.open,
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
*/

    render() {
        const message_text = this.props.message;

        const process_message = (this.props.hide)?this.props.hide:null;
        const message_time = (this.props.time)?this.props.time:4000;

        return (
            <div>
                {
                    (message_text != null) &&
                    <Snackbar
                      open={true}
                      message={message_text}
                      autoHideDuration={message_time}
                    />
                }
            </div>
        );
    }
}

Notification.propTypes = {
    message: React.PropTypes.string,
    width: React.PropTypes.number,
};
