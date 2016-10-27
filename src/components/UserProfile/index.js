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
            bckp_profile: JSON.parse(JSON.stringify(props.profile)),
            groups: props.profile.data.groups,
        };
    }

    dispatchNewRoute(route) {
        browserHistory.push(route);
    }

    delete_tag(e, key) {
        e.preventDefault();
        this.groups = this.state.groups;
        this.groups.splice(key,1);
        this.setState({groups: this.groups});
    }

    edit_profile(e) {
        e.preventDefault();
        this.setState({
            editing: true,
            bckp_profile: JSON.parse(JSON.stringify(this.state.profile))
        });

        e.target.focus();
    }

    save_profile() {
        this.setState({
            editing: false,
        });


        // Try to update data
        if (this.props.onUpdate) {
            this.props.onUpdate(this.props.profile.data);
        }

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
        let editing = this.state.editing;

        const profile = this.state.profile.data;

        const groups = this.state.groups;

        const UserProfile = () => (
            <Card>
                <CardHeader
                  title={profile.email}
                  subtitle={profile.roles}
                  avatar={profile.image}
                />
                <CardTitle
                  title="Personal data"
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
                                    onDoubleClick={(e) => this.edit_profile(e)}
                                  />
                              </div>

                              <div className="col-md-4">
                                  <TextField
                                    hintText="Your surname..."
                                    floatingLabelText="Surname"
                                    value={profile.surname}
                                    onDoubleClick={(e) => this.edit_profile(e)}
                                  />
                              </div>
                          </div>

                          <div className="row">
                              <div className="col-md-12">
                                  <TextField
                                    hintText="user@domain.com"
                                    floatingLabelText="Email"
                                    value={profile.email}
                                    onDoubleClick={(e) => this.edit_profile(e)}
                                  />
                              </div>
                          </div>
                      </form>
                  </CardText>

                  <CardTitle
                    title="Groups"
                  />

                  <CardText>
                  {
                      groups.map((group, index) => (
                          <ProposalTag
                              key={"group_" + index}
                              tag={group}
                              readOnly onDoubleClick={(e) => this.edit_profile(e)}
                              />
                          )
                      )

                  }
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

                  <CardTitle
                    title="Groups"
                  />

                  <CardText>
                  {
                      groups.map((group, index) => (
                          <ProposalTag
                              key={"group_" + index}
                              tag={group}
                              handleRequestDelete={(e) => this.delete_tag(e, index)}
                              />

                          )
                      )

                  }
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
};
