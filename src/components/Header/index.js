import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AppBar from 'material-ui/AppBar';
import LeftNav from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';

import IconButton from 'material-ui/IconButton';

import EuroIcon from 'material-ui/svg-icons/action/euro-symbol';
import ProposalIcon from 'material-ui/svg-icons/action/assessment';
import HistoryIcon from 'material-ui/svg-icons/action/history';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import LogoutIcon from 'material-ui/svg-icons/navigation/close';
import LoginIcon from 'material-ui/svg-icons/social/person';
import RegisterIcon from 'material-ui/svg-icons/social/person-add';
import ProfileIcon from 'material-ui/svg-icons/action/perm-identity';
import DashboardIcon from 'material-ui/svg-icons/action/dashboard';

import FontIcon from 'material-ui/FontIcon';


import * as actionCreators from '../../actions/auth';

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
            <header>
                <LeftNav
                    open={this.state.open}
                    docked={false}
                    onRequestChange={open => this.setState({open})}>

                    <AppBar
                      title="oKW"
                      onClick={() => this.setState({open: false})}
                      iconElementLeft={<IconButton><LogoutIcon /></IconButton>}
                    />

                    {
                        !this.props.isAuthenticated ?
                            <div>

                                <MenuItem onClick={() => this.dispatchNewRoute('/login')}
                                    leftIcon={<LoginIcon/>}
                                >
                                    Login
                                </MenuItem>
                                <MenuItem
                                    onClick={() => this.dispatchNewRoute('/register')}
                                    leftIcon={<RegisterIcon/>}>
                                    Register
                                </MenuItem>
                            </div>
                            :
                            <div>
                                <MenuItem
                                    onClick={() => this.dispatchNewRoute('/dashboard')}
                                    leftIcon={<DashboardIcon/>}
                                    primaryText="Dashboard"
                                />

                                <Divider />

                                <MenuItem
                                    onClick={() => this.dispatchNewRoute('/proposals')}
                                    leftIcon={<ProposalIcon/>}
                                    primaryText="Proposals"
                                />

                                <MenuItem
                                    onClick={() => this.dispatchNewRoute('/buys')}
                                    leftIcon={<EuroIcon/>}
                                    >
                                    Buys
                                </MenuItem>

                                <MenuItem
                                    onClick={() => this.dispatchNewRoute('/history')}
                                    leftIcon={<HistoryIcon/>}
                                    >
                                    History
                                </MenuItem>

                                <Divider />

                                <MenuItem
                                    onClick={() => this.dispatchNewRoute('/settings')}
                                    leftIcon={<ProfileIcon/>}
                                >
                                    Profile
                                </MenuItem>

                                <MenuItem
                                    onClick={() => this.dispatchNewRoute('/settings')}
                                    leftIcon={<SettingsIcon/>}
                                >
                                    Settings
                                </MenuItem>

                                <Divider />

                                <MenuItem
                                    onClick={(e) => this.logout(e)}
                                    leftIcon={<LogoutIcon/>}
                                >
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

        );
    }
}

Header.propTypes = {
    logoutAndRedirect: React.PropTypes.func,
    isAuthenticated: React.PropTypes.bool,
};
