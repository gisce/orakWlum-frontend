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

import {adaptProposalData} from '../../utils/graph';


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
    aggregationsRight: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    aggregationsCenter: {
        display: 'flex',
        justifyContent: 'center',
    },
    aggregations: {
        display: 'flex',
    },
    toggle: {
      marginTop: 7,
    },
    labelToggle: {
        marginTop: 7,
        marginLeft: 7,
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
            aggregations: props.aggregations,
            aggregationSelected: props.aggregations[0].id,
        };
        props.aggregations[0].selected = true;
    }

    dispatchNewRoute(route) {
        browserHistory.push(route);
    }

    toogleProposalRender = (event, status) => {
        this.setState({
            proposalTable: status,
        });
    };

    changeProposalAggregation = (event, agg) => {
        //initialize selection of all elements
        this.state.aggregations.map( function(agg, i) {
            agg.selected = false;
        });

        //select current
        agg.selected=true;

        //save it to change the graph
        this.setState({
            aggregationSelected: agg.id,
        });
    };

    reRunProposal = (event, proposalID) => {
        const token = this.props.token;
        this.props.runProposal(token, proposalID);
    };


    render() {
        const readOnly = (this.props.readOnly)?this.props.readOnly:false;
        const proposal = this.state.proposal;

        const proposalTable = this.state.proposalTable;

        const daysRange = new Date(proposal.days_range[0]).toLocaleDateString(locale, dateOptions) + " - " + new Date(proposal.days_range[1]).toLocaleDateString(locale, dateOptions);

        const lastExecution = new Date(proposal.execution_date).toLocaleString(locale, hourOptions);
        const creationDate = new Date(proposal.creation_date).toLocaleString(locale, hourOptions);
        const ownerText = (proposal.owner)?"by " + proposal.owner:"";

        const withPicture = (proposal.isNew)?!proposal.isNew:true;

        const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        const dayOfProposal = new Date(proposal.days_range[0]).getDay();

        const title = <span>{proposal.name}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[{daysRange}]</span>
        const subtitle = <span>{days[dayOfProposal]} {new Date(proposal.days_range[0]).toLocaleDateString(locale, dateOptions)}</span>;

        const offset = (withPicture)?0:1;
        const size = (withPicture)?8:9;

        const prediction = proposal.prediction;

        const aggregationSelected = this.state.aggregationSelected;
        const changeProposalAggregation=this.changeProposalAggregation;
        const aggregations = this.state.aggregations;

        const reRunProposal=this.reRunProposal;

        let data=null;
        let components=null;

        if (prediction) {
            const predictionAdapted=adaptProposalData(prediction);
            const current = predictionAdapted[aggregationSelected];
            data = current.result;
            components = current.components;
        }


        // The Proposal status!
        const proposalStatus = (
            proposal.status &&
            <div className={"col-md-2 col-lg-2"} style={styles.wrapper}>
                <ProposalTag tag={proposal.status} />
            </div>
        )

        // The Proposal Aggregations List
        const aggregationsStyle = (withPicture)?styles.aggregations:styles.aggregationsRight;
        const proposalAggregations = (
            aggregations &&
                <div
                    id="aggregationsList"
                    className={"col-md-offset-"+ (offset) + " col-md-" + size + " col-lg-offset-"+ (offset) + " col-lg-" + size}
                    style={aggregationsStyle}>
                {
                    aggregations.map( function(agg, i) {
                        return (
                            <div key={"aggregationDivTag_"+i} onClick={(e) => changeProposalAggregation(e, agg)}>
                                 <ProposalTag
                                     key={"aggregationTag_"+i}
                                     tag={agg.lite}
                                     selected={agg.selected}
                                     readOnly/>
                             </div>
                         );
                    })
                }
                </div>

        )

        // The Proposal graph toogle! //to switch between table and chart
        const proposalPictureToggle = (
            (withPicture) &&
            <div
                className="col-xs-offset-0 col-xs-6 col-sm-offset-0 col-sm-3 col-md-2 col-md-offset-0 col-lg-offset-0 col-lg-2"
                style={styles.to_ri}>
              {
              (proposalTable)?
              <div
                  id="togglePicture"
                  className="row"
                  style={styles.aggregationsCenter}
              >
                  <div className="col-xs-2" style={styles.labelToggle}>
                      Chart
                  </div>
                  <div id="toogleElement" className="col-xs-3">
                      <Toggle
                          onToggle={this.toogleProposalRender}
                          style={styles.toggle}
                          toggled={proposalTable}
                      />
                  </div>
                  <div className="col-xs-2" style={styles.toggle}>
                      <b>Table</b>
                  </div>
              </div>
              :
              <div
                  id="togglePicture"
                  className="row"
                  style={styles.aggregationsCenter}
              >
                  <div className="col-xs-2" style={styles.labelToggle}>
                      <b>Chart</b>
                  </div>
                  <div id="toogleElement" className="col-xs-3">
                      <Toggle
                          onToggle={this.toogleProposalRender}
                          style={styles.toggle}
                          toggled={proposalTable}
                      />
                  </div>
                  <div className="col-xs-2" style={styles.toggle}>
                      Table
                  </div>
              </div>
              }
            </div>
            )

        // The Proposal graph!
        const proposalPicture =
            (withPicture)?
                (proposal.prediction) &&
                  (proposalTable)?
                      <ProposalTableMaterial stacked={true} data={data} components={components} height={500} />
                      :
                      <ProposalGraph stacked={true} data={data} components={components} height={500} />
                  :null

        // The resulting Proposal element
        const Proposal = () => (
            <Card>
              <CardTitle title={title} subtitle={subtitle} />

                  <CardMedia
                    overlay={<CardTitle title={title}
                    subtitle={subtitle} />}
                  >
                  </CardMedia>


                  <div className="row">
                      {proposalStatus}

                      {proposalAggregations}

                      {proposalPictureToggle}
                  </div>

              <CardText>
          {       proposal.creation_date &&
                  <p><span>Proposal was created on {creationDate} {ownerText}</span></p>
          }
          {       proposal.execution_date &&
                  <p><span>Last execution was done at {lastExecution}</span></p>
          }
              </CardText>

          {proposalPicture}

          {
              !readOnly &&
              <CardActions>
                <FlatButton label="Run" onClick={(e) => reRunProposal(e, proposal.id)}/>
                <FlatButton label="Detail" />
                <FlatButton label="Edit" />
                <FlatButton label="Duplicate"/>
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
    proposalOld: React.PropTypes.bool,
};
