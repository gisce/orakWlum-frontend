import React, { Component } from 'react'

import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import { PasswordStepper } from '../PasswordStepper';


const styles = {
    dialog: {
      width: '80%',
      maxWidth: 'none',
    }
};

export class PasswordChanger extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: props.open,
        };
    }

    handleOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
    };

    render() {
        const open = this.state.open;

        const actions = [
          <FlatButton
            label="Done"
            primary={true}
            onTouchTap={this.handleClose}
          />,
        ];

        return (
            <Dialog
              title="Change your password"
              actions={actions}
              contentStyle={styles.dialog}
              open={open}
              modal={false}
              onRequestClose={this.handleClose}
            >

                <PasswordStepper />
            </Dialog>
        );
    }
}

PasswordChanger.propTypes = {
    open: React.PropTypes.bool,
};
