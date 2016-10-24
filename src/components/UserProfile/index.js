import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import TextField from 'material-ui/TextField';

import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import {orange300, orange900, green300, green900, red300, red900} from 'material-ui/styles/colors';


import * as actionCreators from '../../actions/proposal';

import { ProposalTag } from '../ProposalTag';

function handleRequestDelete() {
    alert('Treure TAG.');
}

function handleTouchTap() {
    alert('Filtrar per aquest TAG.');
}

const styles = {
    chip: {
      margin: 4,
    },
    wrapper: {
      display: 'flex',
      flexWrap: 'wrap',
    },
};

const colors = {
    pending: {
        hard: orange900,
        soft: orange300,
        text: 'white',
    },
    accepted: {
        hard: green900,
        soft: green300,
        text: 'white',
    },
    denied: {
        hard: red900,
        soft: red300,
        text: 'white',
    },
}

function mapStateToProps(state) {
    return {
        token: state.auth.token,
        userName: state.auth.userName,
        isAuthenticated: state.auth.isAuthenticated,
        profile: state.profile,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export class UserProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profile: props.profile,
            editing: false,
            bckp_profile: JSON.parse(JSON.stringify(props.profile))
        };
    }

    dispatchNewRoute(route) {
        browserHistory.push(route);
    }

    edit_profile(e) {
        e.preventDefault();
        this.setState({
            editing: true,
        });

        this.setState({
            bckp_profile: JSON.parse(JSON.stringify(this.state.profile))
        });
    }

    save_profile(e) {
        e.preventDefault();
        this.setState({
            editing: false,
        });

        const profile = JSON.parse(JSON.stringify(this.props.profile));
        this.setState({
            profile: profile,
        });
    }

    tmpChangeValue(e, type) {
        const value = e.target.value;
        this.props.profile.data[type] = value;
    }

    discard_edit_profile(e) {
        e.preventDefault();
        const profile = JSON.parse(JSON.stringify(this.state.bckp_profile));

        this.setState({
            editing: false,
            profile: profile,
        });
    }

    delete_profile(e) {
        e.preventDefault();
        this.setState({
            editing: false,
        });
    }

    render() {
        let editing = this.state.editing;;

        const profile = this.state.profile.data;
        const UserProfile = () => (
            <Card>
                <CardHeader
                  title={profile.email}
                  subtitle={profile.groups}
                  avatar={profile.image}
                />
              <CardTitle
                  title={profile.email}
                  subtitle={profile.groups}
              />

          {
          ( !editing ) ?
                <div>
                  <CardText>
                      <form role="form">
                          <div className="row">
                              <div className="col-md-4">
                                  <TextField
                                    hintText="Your name..."
                                    floatingLabelText="Name"
                                    value={profile.name}
                                  />
                              </div>

                              <div className="col-md-4">
                                  <TextField
                                    hintText="Your surname..."
                                    floatingLabelText="Surname"
                                    value={profile.surname}
                                  />
                              </div>
                          </div>

                          <div className="row">
                              <div className="col-md-12">
                                  <TextField
                                    hintText="user@domain.com"
                                    floatingLabelText="Email"
                                    value={profile.email}
                                  />
                              </div>
                          </div>
                      </form>
                  </CardText>

                  <CardActions>
                    <FlatButton
                        onClick={(e) => this.edit_profile(e, {profile})}
                        label="Edit" />
                    <FlatButton
                        onClick={(e) => this.delete_profile(e)}
                        label="Delete" />
                  </CardActions>
              </div>

              :
              <div>
                  <CardText>
                      <form role="form">
                          <div className="row">
                              <div className="col-md-4">
                                  <TextField
                                    hintText="Your name..."
                                    floatingLabelText="Name"
                                    defaultValue={profile.name}
                                    floatingLabelFixed={true}
                                    onChange={(e) => this.tmpChangeValue(e, 'name')}
                                  />
                              </div>

                              <div className="col-md-4">
                                  <TextField
                                    hintText="Your surname..."
                                    floatingLabelText="Surname"
                                    defaultValue={profile.surname}
                                    floatingLabelFixed={true}
                                    onChange={(e) => this.tmpChangeValue(e, 'surname')}
                                  />
                              </div>
                          </div>

                          <div className="row">
                              <div className="col-md-12">
                                  <TextField
                                    hintText="user@domain.com"
                                    floatingLabelText="Email"
                                    defaultValue={profile.email}
                                    floatingLabelFixed={true}
                                    onChange={(e) => this.tmpChangeValue(e, 'email')}
                                  />
                              </div>
                          </div>
                      </form>
                  </CardText>
                  <CardActions>
                    <FlatButton
                        onClick={(e) => this.save_profile(e)}
                        label="Save" />
                    <FlatButton
                        onClick={(e) => this.discard_edit_profile(e)}
                        label="Cancel" />
                    <FlatButton
                        onClick={(e) => this.delete_profile(e)}
                        label="Delete" />
                  </CardActions>
              </div>
          }

            </Card>
        );

        return (
            <UserProfile />
        );
    }
}

UserProfile.propTypes = {
    logoutAndRedirect: React.PropTypes.func,
    isAuthenticated: React.PropTypes.bool,
};
