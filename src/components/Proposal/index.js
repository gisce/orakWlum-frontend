import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import {orange300, orange900, green300, green900, red300, red900} from 'material-ui/styles/colors';

import Toggle from 'material-ui/Toggle';

import * as actionCreators from '../../actions/proposal';

import { ProposalTag } from '../ProposalTag';
import { ProposalGraph } from '../ProposalGraph';
import { ProposalTableMaterial } from '../ProposalTableMaterial';

const locale = 'es';
const dateOptions = {
    day: '2-digit',
    year: 'numeric',
    month: '2-digit',
};
const hourOptions = {
    day: '2-digit',
    year: 'numeric',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
};

const styles = {
    chip: {
      margin: 4,
    },
    wrapper: {
      display: 'flex',
    },
    toggle: {
        marginTop: 7,
      marginLeft: 7,
      textAlign: "right",
    },
    toRight: {
        textAlign: "right",
    }
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
export class Proposal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            proposal: props.proposal,
            proposalTable: false,
        };
    }

    dispatchNewRoute(route) {
        browserHistory.push(route);
    }

    toogleProposalRender = (event, status) => {
        this.setState({
            proposalTable: status,
        });
    };

    render() {
        const readOnly = (this.props.readOnly)?this.props.readOnly:false;
        const proposal = this.state.proposal;

        const proposalTable = this.state.proposalTable;

        const daysRange = new Date(proposal.days_range[0]).toLocaleDateString(locale, dateOptions) + " - " + new Date(proposal.days_range[1]).toLocaleDateString(locale, dateOptions);

        const lastExecution = new Date(proposal.execution_date).toLocaleString(locale, hourOptions);
        const creationDate = new Date(proposal.creation_date).toLocaleString(locale, hourOptions);
        const ownerText = (proposal.owner)?"by " + proposal.owner:"";

        const title = <span>{proposal.name}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[{daysRange}]</span>
        const subtitle = <span>{daysRange}</span>;

        const Proposal = () => (
            <Card>
              <CardTitle title={title} subtitle={subtitle} />

                  <CardMedia
                    overlay={<CardTitle title={title}
                    subtitle={subtitle} />}
                  >
                  </CardMedia>


                  <div className="row">
                  {
                      proposal.status &&
                      <div className="col-md-3 col-lg-4" style={styles.wrapper}>
                          <ProposalTag tag={proposal.status} />
                      </div>
                  }

                  {
                      proposal.aggregations &&
                      <div>
                          <div className="col-md-offset-1 col-md-5 col-lg-offset-0 col-lg-4" style={styles.wrapper}>
                          {
                              proposal.aggregations.map( function(agg, i) {
                                  return (
                                       <ProposalTag key={"aggregationTag_"+i} tag={agg.lite} readOnly/>
                                   );
                              })
                          }
                          </div>
                          <div className="col-xs-offset-0 col-xs-2 col-sm-offset-0 col-sm-1 col-md-1 col-md-offset-1 col-lg-offset-2 col-lg-1" style={styles.toRight}>
                            {
                            (proposalTable)?
                                <Toggle
                                    label="Chart"
                                    labelPosition="left"
                                    onToggle={this.toogleProposalRender}
                                    style={styles.toggle}
                                    toggled={proposalTable}
                                />
                            :
                                <Toggle
                                    label="Table"
                                    labelPosition="right"
                                    onToggle={this.toogleProposalRender}
                                    style={styles.toggle}
                                    toggled={proposalTable}
                                />
                            }
                          </div>
                      </div>
                  }
                  </div>

              <CardText>


          {       proposal.creation_date &&
                  <p><span>Proposal was created on {creationDate} {ownerText}</span></p>
          }

          {       proposal.execution_date &&
                  <p><span>Last execution was done at {lastExecution}</span></p>
          }
              </CardText>

          {
              proposal.prediction &&
                (proposalTable)?
                    <ProposalTableMaterial stacked={true} proposal={proposal} height={500} />
                    :
                    <ProposalGraph stacked={true} proposal={proposal} height={500} />
          }

          {
              !readOnly &&
              <CardActions>
                <FlatButton label="Run" />
                <FlatButton label="Detail" />
                <FlatButton label="Edit" />
                <FlatButton label="Delete" />
              </CardActions>
          }

            </Card>
        );

        return (
            <div>
                <Proposal/>
            </div>
        );
    }
}

Proposal.propTypes = {
    readOnly: React.PropTypes.bool,
};
