import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
import AboutIcon from 'material-ui/svg-icons/action/info-outline';
import AggregationsIcon from 'material-ui/svg-icons/action/donut-large';

import FontIcon from 'material-ui/FontIcon';
import Breadcrumb from '../Breadcrumb';

import { dispatchNewRoute} from '../../utils/http_functions';

import * as actionCreators from '../../actions/auth';

import {FormattedHTMLMessage} from 'react-intl';

function mapStateToProps(state) {
    return {
        token: state.auth.token,
        userName: state.auth.userName,
        userRoles: state.auth.userRoles,
        userGroups: state.auth.userGroups,
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

    dispatchRoute(event, route) {
        dispatchNewRoute(route, event);

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
                      title="orakWlum"
                      onClick={() => this.setState({open: false})}
                      iconElementLeft={<IconButton><LogoutIcon /></IconButton>}
                    />

                    {
                        !this.props.isAuthenticated ?
                            <div>
                                <MenuItem
                                    onClick={(event) => this.dispatchRoute(event,'/login')}
                                    leftIcon={<LoginIcon/>}
                                    primaryText={<FormattedHTMLMessage id="HeaderView.login"
                                                  defaultMessage="Login"/>}
                                />
                                <MenuItem
                                    onClick={(event) => this.dispatchRoute(event,'/register')}
                                    leftIcon={<RegisterIcon/>}
                                    primaryText={<FormattedHTMLMessage id="HeaderView.register"
                                                  defaultMessage="Register"/>}
                                />
                            </div>
                            :
                            <div>
                                <Card
                                    style={styles.userPanel}
                                    onClick={(event) => this.dispatchRoute(event,'/profile')}
                                >
                                    <CardHeader
                                      title={this.props.userName}
                                      subtitle={this.props.userRoles}
                                      avatar={this.props.userImage}
                                    />
                                </Card>

                                <MenuItem
                                    leftIcon={<DashboardIcon/>}
                                    primaryText={<FormattedHTMLMessage id="HeaderView.elements"
                                                  defaultMessage="Elements"/>}
                                    onClick={(event) => this.dispatchRoute(event, '/elements')}
                                />

                                {/*<MenuItem
                                    leftIcon={<DashboardIcon/>}
                                    primaryText={"Elements (old)"}
                                    onClick={(event) => this.dispatchRoute(event, '/elementsOld')}
                                />*/}

                                <Divider />

                                <MenuItem
                                    onClick={(event) => this.dispatchRoute(event,'/elements/type/proposal')}
                                    leftIcon={<ProposalIcon/>}
                                    primaryText={<FormattedHTMLMessage id="HeaderView.proposals"
                                                  defaultMessage="Proposals"/>}
                                />
                                <MenuItem
                                    onClick={(event) => this.dispatchRoute(event,'/elements/type/historical')}
                                    leftIcon={<HistoryIcon/>}
                                    primaryText={<FormattedHTMLMessage id="HeaderView.historicals"
                                                  defaultMessage="Historicals"/>}
                                />
                                <MenuItem
//                                    onClick={(event) => this.dispatchRoute(event,'/buys')}
                                    leftIcon={<EuroIcon/>}
                                    primaryText={<FormattedHTMLMessage id="HeaderView.buys"
                                                  defaultMessage="Buys"/>}
                                    disabled
                                />

                                <Divider />

                                <MenuItem
                                    onClick={(event) => this.dispatchRoute(event,'/aggregations')}
                                    leftIcon={<AggregationsIcon/>}
                                    primaryText={<FormattedHTMLMessage id="HeaderView.aggregations"
                                                  defaultMessage="Aggregations"/>}
                                />

                                <MenuItem
                                    onClick={(event) => this.dispatchRoute(event,'/sources')}
                                    leftIcon={<SettingsIcon/>}
                                    primaryText={<FormattedHTMLMessage id="HeaderView.sources"
                                                  defaultMessage="Sources"/>}
                                />

                                <Divider />

                                <MenuItem
                                    onClick={(event) => this.dispatchRoute(event,'/profile')}
                                    leftIcon={<ProfileIcon/>}
                                    primaryText={<FormattedHTMLMessage id="HeaderView.profile"
                                                  defaultMessage="Profile"/>}
                                />
                                <MenuItem
                                    onClick={(event) => this.dispatchRoute(event,'/about')}
                                    leftIcon={<AboutIcon/>}
                                    primaryText={<FormattedHTMLMessage id="HeaderView.about"
                                                  defaultMessage="About"/>}
                                />

                                <Divider />

                                <MenuItem
                                    onClick={(e) => this.logout(e)}
                                    leftIcon={<LogoutIcon/>}
                                    primaryText={<FormattedHTMLMessage id="HeaderView.logout"
                                                  defaultMessage="Logout"/>}
                                />
                            </div>
                    }
                </LeftNav>

                <AppBar
                  title="orakWlum"
                  onLeftIconButtonTouchTap={() => this.openNav()}
//                  iconElementRight={<FlatButton label="Proposals" onClick={(event) => this.dispatchRoute(event,'/proposals')}/>}
                />

            <Breadcrumb path={this.props.path}/>

            </header>

        );
    }
}

Header.propTypes = {
    logoutAndRedirect: PropTypes.func,
    isAuthenticated: PropTypes.bool,
};
