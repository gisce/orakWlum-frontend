import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import {orange300, orange900, green300, green900, red300, red900} from 'material-ui/styles/colors';


import * as actionCreators from '../../actions/proposal';

import { ProposalTag } from '../ProposalTag';
import { ProposalGraph } from '../ProposalGraph';


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
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export class Proposal0 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            proposal: props.proposal,
        };
    }

    dispatchNewRoute(route) {
        browserHistory.push(route);
    }

    render() {
        const proposal = this.state.proposal;
        const Proposal = () => (
            <Card>
              <CardTitle title={proposal.name} subtitle={<span>{new Date(proposal.creation_date).toLocaleString()}</span>} />

                  <CardMedia
                    overlay={<CardTitle title={proposal.name}
                    subtitle={<span>{new Date(proposal.creation_date).toLocaleString()}</span>} />}
                  >
                  </CardMedia>


              <div style={styles.wrapper}>
                  <ProposalTag tag={proposal.status} />
              </div>

              <CardText>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
                Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
                Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
              </CardText>

              <ProposalGraph stacked={true} proposal={proposal}/>

              <CardActions>
                <FlatButton label="Run" />
                <FlatButton label="Detail" />
                <FlatButton label="Edit" />
                <FlatButton label="Delete" />
              </CardActions>
            </Card>
        );

        return (
            <div>

                <div>
                </div>

                <Proposal/>
            </div>
        );
    }
}

Proposal0.propTypes = {
    logoutAndRedirect: React.PropTypes.func,
    isAuthenticated: React.PropTypes.bool,
};
