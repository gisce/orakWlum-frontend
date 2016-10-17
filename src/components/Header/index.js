import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AppBar from 'material-ui/AppBar';
import LeftNav from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';

import * as actionCreators from '../../actions/auth';


//Colors
import {
    deepOrange500,
    deepOrange300,
    yellow500,
    blue500,
    white,

    orange700,
    orange400,
    amber400,
    amber200,

} from 'material-ui/styles/colors';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


const muiTheme = getMuiTheme({
    palette: {
        primary1Color: orange400,
        primary2Color: orange400,
        primary3Color: amber200,
    },
});


function mapStateToProps(state) {
    return {
        token: state.auth.token,
        userName: state.auth.userName,
        isAuthenticated: state.auth.isAuthenticated,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
        };

    }

    dispatchNewRoute(route) {
        browserHistory.push(route);
        this.setState({
            open: false,
        });

    }


    handleClickOutside() {
        this.setState({
            open: false,
        });
    }


    logout(e) {
        e.preventDefault();
        this.props.logoutAndRedirect();
        this.setState({
            open: false,
        });
    }

    openNav() {
        this.setState({
            open: true,
        });
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <header>
                    <LeftNav
                        open={this.state.open}
                        docked={false}
                        onRequestChange={open => this.setState({open})}

                    >
                        {
                            !this.props.isAuthenticated ?
                                <div>
                                    <MenuItem onClick={() => this.dispatchNewRoute('/login')}>
                                        Login
                                    </MenuItem>
                                    <MenuItem onClick={() => this.dispatchNewRoute('/register')}>
                                        Register
                                    </MenuItem>
                                </div>
                                :
                                <div>
                                    <MenuItem onClick={() => this.dispatchNewRoute('/analytics')}>
                                        Analytics
                                    </MenuItem>
                                    <Divider />

                                    <MenuItem onClick={(e) => this.logout(e)}>
                                        Logout
                                    </MenuItem>
                                </div>
                        }
                    </LeftNav>
                    <AppBar
                      title="oraKWlum"
                      onLeftIconButtonTouchTap={() => this.openNav()}
                      iconElementRight={
                          <FlatButton label="Home" onClick={() => this.dispatchNewRoute('/')} />
                        }
                    />
                </header>
            </MuiThemeProvider>

        );
    }
}

Header.propTypes = {
    logoutAndRedirect: React.PropTypes.func,
    isAuthenticated: React.PropTypes.bool,
};
