import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AppBar from 'material-ui/AppBar';
import LeftNav from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

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

import Breadcrumb from '../Breadcrumb';

import * as actionCreators from '../../actions/auth';

function mapStateToProps(state) {
    return {
        token: state.auth.token,
        userName: state.auth.userName,
        userRoles: state.auth.userRoles,
        userImage: state.auth.userImage,
        isAuthenticated: state.auth.isAuthenticated,
        path: state.routing.locationBeforeTransitions.pathname,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}


const styles = {
  userPanel: {
    cursor: 'pointer',
  },
};


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
                    disableSwipeToOpen={false}
                    swipeAreaWidth={30}
                    onRequestChange={open => this.setState({open})}
                >

                    <AppBar
                      title="oKW"
                      onClick={() => this.setState({open: false})}
                      iconElementLeft={<IconButton><LogoutIcon /></IconButton>}
                    />

                    {
                        !this.props.isAuthenticated ?
                            <div>
                                <MenuItem
                                    onClick={() => this.dispatchNewRoute('/login')}
                                    leftIcon={<LoginIcon/>}
                                    primaryText="Login"
                                />
                                <MenuItem
                                    onClick={() => this.dispatchNewRoute('/register')}
                                    leftIcon={<RegisterIcon/>}
                                    primaryText="Register"
                                />
                            </div>
                            :
                            <div>
                                <Card
                                    style={styles.userPanel}
                                    onClick={() => this.dispatchNewRoute('/profile')}
                                >
                                    <CardHeader
                                      title={this.props.userName}
                                      subtitle={this.props.userRoles}
                                      avatar={this.props.userImage}
                                    />
                                </Card>

                                <MenuItem
                                    onClick={() => this.dispatchNewRoute('/dashboard')}
                                    leftIcon={<DashboardIcon/>}
                                    primaryText={"Dashboard"}
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
                                    primaryText="Buys"
                                />
                                <MenuItem
                                    onClick={() => this.dispatchNewRoute('/history')}
                                    leftIcon={<HistoryIcon/>}
                                    primaryText="History"
                                />

                                <Divider />

                                <MenuItem
                                    onClick={() => this.dispatchNewRoute('/profile')}
                                    leftIcon={<ProfileIcon/>}
                                    primaryText="Profile"
                                />
                                <MenuItem
                                    onClick={() => this.dispatchNewRoute('/settings')}
                                    leftIcon={<SettingsIcon/>}
                                    primaryText="Settings"
                                />

                                <Divider />

                                <MenuItem
                                    onClick={(e) => this.logout(e)}
                                    leftIcon={<LogoutIcon/>}
                                    primaryText="Logout"
                                />
                            </div>
                    }
                </LeftNav>

                <AppBar
                  title="oraKWlum"
                  onLeftIconButtonTouchTap={() => this.openNav()}
                  iconElementRight={<FlatButton label="Dashboard" onClick={() => this.dispatchNewRoute('/dashboard')}/>}
                />

            <Breadcrumb path={this.props.path}/>

            </header>

        );
    }
}

Header.propTypes = {
    logoutAndRedirect: React.PropTypes.func,
    isAuthenticated: React.PropTypes.bool,
};
