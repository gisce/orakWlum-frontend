import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../actions/profile';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';

import { ProposalTag } from '../ProposalTag';
import { PasswordChanger } from '../PasswordChanger';

//Icons
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import CancelIcon from 'material-ui/svg-icons/navigation/cancel';
import SaveIcon from 'material-ui/svg-icons/content/save';
import KeyIcon from 'material-ui/svg-icons/communication/vpn-key';

import { MD5 } from '../../utils/misc'

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
export class UserProfile extends Component {
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

    edit_profile(e) {
        e.preventDefault();
        this.setState({
            password_open: false,
            editing: true,
            bckp_profile: JSON.parse(JSON.stringify(this.state.profile)),
            bckp_groups: Object.assign([], this.state.groups)
        });
    }

    edit_password(e) {
        e.preventDefault();
        this.setState({
            password_open: true,
        });
    }

    save_profile(e) {
        e.preventDefault();
        const profile = JSON.parse(JSON.stringify(this.props.profile));

        this.setState({
            password_open: false,
            editing: false,
            profile: profile,
        });

        // Try to update data
        if (this.props.onUpdate) {
            this.props.onUpdate(this.props.profile.data);
        }

        this.activateSnack()
    }

    tmpChangeValue(e, type) {
        const value = e.target.value;
        this.props.profile.data[type] = value;
    }

    discard_edit_profile(e) {
        e.preventDefault();

        const profile = JSON.parse(JSON.stringify(this.state.bckp_profile));
        const groups = this.state.bckp_groups;

        this.setState({
            editing: false,
            profile: profile,
            groups: groups,
            password_open: false,
        });
    }

    delete_tag(e, key) {
        e.preventDefault();
        this.groups = this.state.groups;
        this.groups.splice(key,1);
        this.setState({groups: this.groups});
    }

    delete_profile(e) {
        e.preventDefault();
        alert("Are you sure? WIP");
        this.setState({
            editing: false,
        });
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
        let editing = this.state.editing;

        const profile = this.state.profile.data;

        const groups = this.state.groups;

        const message_open = this.state.message_open;

        const emailHash = MD5(profile.email);

        //Load gravatar img or default from github
        const image = "https://www.gravatar.com/avatar/"+emailHash+"?d=https://raw.githubusercontent.com/gisce/oraKWlum-frontend/master/www/public/images/user.jpg";

        const UserProfile = () => (

            <div>
            {
                this.props.statusText &&
                        <Snackbar
                          open={this.state.message_open}
                          message={this.props.statusText}
                          autoHideDuration={4000}
                          onActionTouchTap={this.undoChanges}
                          onRequestClose={this.deactivateSnack}
                        />
            }


                <Card>
                    <CardHeader
                      title={profile.email}
                      subtitle={profile.roles}
                      avatar={image}
                    />
                    <CardTitle
                      title="Personal data"
                    />

            {
                this.state.password_open &&
                    <PasswordChanger open={this.state.password_open}/>
            }

            {
                ( !editing ) ?
                    <div>
                      <CardText>
                          <form role="form">
                              <div className="row">
                                  <div className="col-md-4">
                                      <TextField
                                        autoFocus={true}
                                        id="changeName"
                                        hintText="Your name..."
                                        floatingLabelText="Name"
                                        value={profile.name}
                                        onDoubleClick={(e) => this.edit_profile(e)}
                                        onKeyPress={(e) => this.edit_profile(e)}
                                      />
                                  </div>

                                  <div className="col-md-4">
                                      <TextField
                                        id="changeSurname"
                                        hintText="Your surname..."
                                        floatingLabelText="Surname"
                                        value={profile.surname}
                                        onDoubleClick={(e) => this.edit_profile(e)}
                                        onKeyPress={(e) => this.edit_profile(e)}
                                      />
                                  </div>

                              </div>

                              <div className="row">
                                  <div className="col-md-12">
                                      <TextField
                                        id="changeEmail"
                                        hintText="user@domain.com"
                                        floatingLabelText="Email"
                                        value={profile.email}
                                        onDoubleClick={(e) => this.edit_profile(e)}
                                        onKeyPress={(e) => this.edit_profile(e)}
                                      />
                                  </div>
                              </div>
                          </form>
                      </CardText>

                      <CardTitle
                        title="Groups"
                      />
                      <CardText>
                          <div style={styles.wrapper}>
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
                          </div>
                      </CardText>


                      <CardTitle
                        title="Password"
                      />
                      <CardText>
                          <form role="form">
                              <div className="row">
                                  <div className="col-md-4">
                                      <TextField
                                        hintText="************"
                                        value="************"
                                        floatingLabelText="Your password"
                                        floatingLabelFixed={true}
                                        readOnly onDoubleClick={(e) => this.edit_password(e)}
                                      />
                                  </div>
                              </div>
                          </form>
                      </CardText>

                      <CardActions>
                        <FlatButton
                            onClick={(e) => this.edit_profile(e, {profile})}
                            label="Edit"
                            icon={<EditIcon/>}
                        />
                        <FlatButton
                            onClick={(e) => this.edit_password(e)}
                            label="Change password"
                            icon={<KeyIcon/>}
                        />
                      </CardActions>
                    </div>
                :
                    <div>
                      <CardText>
                          <form role="form">
                              <div className="row">
                                  <div className="col-md-4">
                                      <TextField
                                        autoFocus={true}
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
                          <div style={styles.wrapper}>
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
                          </div>
                      </CardText>


                      <CardTitle
                        title="Password"
                      />
                      <CardText>
                          <form role="form">
                              <div className="row">
                                  <div className="col-md-4">
                                      <TextField
                                        hintText="************"
                                        value="************"
                                        floatingLabelText="Your password"
                                        floatingLabelFixed={true}
                                        readOnly onDoubleClick={(e) => this.edit_password(e)}
                                      />
                                  </div>
                              </div>
                          </form>
                      </CardText>

                      <CardActions>
                        <FlatButton
                            onClick={(e) => this.save_profile(e)}
                            label="Save"
                            icon={<SaveIcon/>}
                        />
                        <FlatButton
                            onClick={(e) => this.discard_edit_profile(e)}
                            label="Cancel"
                            icon={<CancelIcon/>}
                        />
                        <FlatButton
                            onClick={(e) => this.delete_profile(e)}
                            label="Delete"
                            icon={<DeleteIcon/>}
                        />
                      </CardActions>
                  </div>
                }

                </Card>
            </div>
        );

        return (
            <UserProfile />
        );
    }
}

UserProfile.propTypes = {
};
