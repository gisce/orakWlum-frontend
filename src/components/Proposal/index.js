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

import { ProposalDetail } from '../ProposalDetail';

import { Notification } from '../Notification';
import Dialog from 'material-ui/Dialog';

//Icons
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh';
import RunIcon from 'material-ui/svg-icons/av/play-circle-outline';
import ExpandIcon from 'material-ui/svg-icons/navigation/expand-more';
import CollapseIcon from 'material-ui/svg-icons/navigation/expand-less';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import DuplicateIcon from 'material-ui/svg-icons/content/content-copy';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import ExportIcon from 'material-ui/svg-icons/file/file-download';

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
    },
    cardSeparator: {
        marginTop: 50,
        marginBottom: 20,
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
        message_text: state.proposal.message_text,
        message_open: state.proposal.message_open,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export class Proposal extends Component {
    constructor(props) {
        super(props);

        this.confirmation = {
            open: false,
        }

        this.state = {
            proposal: props.proposal,
            proposalTable: false,
            aggregations: props.aggregations,
            aggregationSelected: props.aggregations[0].id,
            message_text: props.message_text,
            message_open: false,
            confirmation_text: null,
            confirmation_open: false,
        };

        this.animateChart = true;

        props.aggregations[0].selected = true;
    }

    dispatchNewRoute(route) {
        browserHistory.push(route);
    }

    dummyAsync = (cb) => {
        this.setState({loading: true}, () => {
            this.asyncTimer = setTimeout(cb, 2000);
        });
    };

    toogleProposalRender = (event, status) => {
        this.setState({
            proposalTable: status,
            message_open: false,
        });
        this.animateChart = false;
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
            message_open: false,
        });

        this.animateChart = false;
    };

    handleOpenConfirmation = (open) => {
      this.setState({
          confirmation_open: true,
      });
    };

    handleCloseConfirmation = (open) => {
      this.setState({confirmation_open: false});
    };

    refreshProposalQuestion = (event, proposalID) => {
        event.preventDefault();
        this.confirmation.confirmation_open = true;

        this.animateChart = false;

        const actionsButtons = [
          <FlatButton
            label="Cancel"
            primary={true}
            onTouchTap={this.handleCloseConfirmation}
          />,
          <FlatButton
            label="Submit"
            primary={true}
            keyboardFocused={true}
            onTouchTap={() => this.refreshProposal(proposalID)}
          />,
        ];

        this.confirmation.title = "Refresh current proposal";
        this.confirmation.text = <div><p>The Proposal will be refreshed fetching the last changes at DB. Unsaved changes will be discarted.</p><p>Are you sure about to <b>refresh this Proposal</b>?</p></div>;
        this.confirmation.actionsButtons = actionsButtons;

        this.setState({
            message_open: false,
            confirmation_open: true,
        });

    };

    refreshProposal = (proposalID) => {
        this.setState({
            confirmation_open: false,
        });
        this.animateChart = false;

        const token = this.props.token;
        this.props.fetchProposal(token, proposalID);

        this.setState({
            message_open: true,
        });

        this.animateChart = true;
    };




    reRunProposalQuestion = (event, proposalID) => {
        event.preventDefault();
        this.confirmation.confirmation_open = true;

        const actionsButtons = [
          <FlatButton
            label="Cancel"
            primary={true}
            onTouchTap={this.handleCloseConfirmation}
          />,
          <FlatButton
            label="Submit"
            primary={true}
            keyboardFocused={true}
            onTouchTap={() => this.reRunProposal(proposalID)}
          />,
        ];

        this.confirmation.title = "Reprocess current Proposal";
        this.confirmation.text = <div><p>The Proposal will be reprocessed using the last data on DB. It can take a few seconds...</p><p>Are you sure about to <b>reprocess this Proposal</b>?</p></div>;
        this.confirmation.actionsButtons = actionsButtons;

        this.setState({
            message_open: false,
            confirmation_open: true,
        });

        this.animateChart = false;
    };

    reRunProposal = (proposalID) => {
        this.animateChart = false;
        this.setState({
            message_open: true,
            confirmation_open: false,
        });

        const token = this.props.token;
        this.props.runProposal(token, proposalID);

        this.dummyAsync(() =>
            this.animateChart = true
        );

        this.animateChart = true;

    };


    toggleDetail = () => {
        this.detail_open = !this.detail_open;

        this.animateChart = false;

        this.setState({
            detail_open: this.detail_open,
        });
    };



    duplicateProposalQuestion = (event, proposalID) => {
        event.preventDefault();
        this.confirmation.confirmation_open = true;

        const actionsButtons = [
          <FlatButton
            label="Cancel"
            primary={true}
            onTouchTap={this.handleCloseConfirmation}
          />,
          <FlatButton
            label="Submit"
            primary={true}
            keyboardFocused={true}
            onTouchTap={() => this.duplicateProposal(proposalID)}
          />,
        ];

        this.confirmation.title = "Duplicate current Proposal";
        this.confirmation.text = <div><p>The Proposal will be duplicated. The consumptions will not be reprocessed, if needed "Run" the new Proposal once it's cloned.</p><p>Are you sure about to <b>duplicate this Proposal</b>?</p></div>;
        this.confirmation.actionsButtons = actionsButtons;

        this.animateChart = false;
        this.setState({
            message_open: false,
            confirmation_open: true,
        });
    };

    duplicateProposal = (proposalID) => {
        this.animateChart = false;
        this.setState({
            message_open: true,
            confirmation_open: false,
        });
        const token = this.props.token;
        this.props.duplicateProposal(token, proposalID);
    };

    deleteProposalQuestion = (event, proposalID) => {
        event.preventDefault();
        this.confirmation.confirmation_open = true;

        const actionsButtons = [
          <FlatButton
            label="Cancel"
            primary={true}
            onTouchTap={this.handleCloseConfirmation}
          />,
          <FlatButton
            label="Submit"
            primary={true}
            keyboardFocused={true}
            onTouchTap={() => this.deleteProposal(proposalID)}
          />,
        ];

        this.confirmation.title = "Delete current Proposal";
        this.confirmation.text = <div><p>The Proposal will be deleted. This process can't be undone...</p><p>Are you sure about to <b>delete this Proposal</b>?</p></div>;
        this.confirmation.actionsButtons = actionsButtons;

        this.animateChart = false;
        this.setState({
            message_open: false,
            confirmation_open: true,
        });
    };

    deleteProposal = (proposalID) => {
        this.animateChart = false;
        this.setState({
            message_open: true,
            confirmation_open: false,
        });
        const token = this.props.token;
        this.props.deleteProposal(token, proposalID);
    };

    exportProposal = (event, proposalID) => {
        event.preventDefault();

        this.setState({
            animateChart: false,
            message_text: "Exporting current proposal",
            confirmation_open: false,
        });

        const token = this.props.token;
        this.props.exportProposal(token, proposalID);
    };


    handleConfirmation = (what, message, text) => {
        this.next = what;
        this.message = message
        this.text = text
        this.open_confirmation = true;
    }

    render() {
        const readOnly = (this.props.readOnly)?this.props.readOnly:false;
        const proposal = this.props.proposal;

        const proposalTable = this.state.proposalTable;

        const historical = (proposal.historical == false)?false:true;

        const daysRange = new Date(proposal.days_range[0]).toLocaleDateString(locale, dateOptions) + " - " + new Date(proposal.days_range[1]).toLocaleDateString(locale, dateOptions);

        const lastExecution = new Date(proposal.execution_date).toLocaleString(locale, hourOptions);
        const creationDate = new Date(proposal.creation_date).toLocaleString(locale, hourOptions);
        const ownerText = (proposal.owner)?"by " + proposal.owner:"";

        const withPicture = (proposal.isNew)?!proposal.isNew:true;

        const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

        const dayOfProposal = new Date(proposal.days_range[0]).getDay();
        const dayOfProposalFuture = (historical) ? null : new Date(proposal.days_range_future[0]).getDay();



        let daysRange_toShow;
        if (historical == false) {
             daysRange_toShow = new Date(proposal.days_range_future[0]).toLocaleDateString(locale, dateOptions) + " - " + new Date(proposal.days_range_future[1]).toLocaleDateString(locale, dateOptions);

        } else {
             daysRange_toShow = daysRange;
        }
        const day_string = new Date(proposal.days_range[0]).toLocaleDateString(locale, dateOptions);

        const title = <span>{proposal.name}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[{daysRange_toShow}]</span>
        const subtitle = <span>Using {days[dayOfProposal]} {day_string}</span>;

        const offset = (withPicture)?0:1;
        const size = (withPicture)?8:9;

        const prediction = proposal.prediction;

        const aggregationSelected = this.state.aggregationSelected;
        const changeProposalAggregation=this.changeProposalAggregation;
        const aggregations = this.state.aggregations;

        const refreshProposal = this.refreshProposalQuestion;
        const reRunProposal = this.reRunProposalQuestion;
        const duplicateProposal = this.duplicateProposalQuestion;
        const deleteProposal = this.deleteProposalQuestion;
        const exportProposal=this.exportProposal;

        const toggleDetail = this.toggleDetail;

        const detail_open = this.detail_open;

        const DetailIcon = (detail_open == true)?CollapseIcon:ExpandIcon;

        const actionsButtons = [
          <FlatButton
            label="Cancel"
            primary={true}
            onTouchTap={this.handleCloseConfirmation}
          />,
          <FlatButton
            label="Submit"
            primary={true}
            keyboardFocused={true}
            onTouchTap={this.handleCloseConfirmation}
          />,
        ];


        let data=null;
        let components=null;
        let summary = null;

        if (prediction) {
            const predictionAdapted=adaptProposalData(prediction);
            const current = predictionAdapted[aggregationSelected];
            data = current.result;
            components = current.components;
            summary = (prediction.summary != undefined)?prediction.summary:null;
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
                  (
                      (proposalTable)?
                          <ProposalTableMaterial stacked={true} data={data} components={components} height={500} unit={"kWh"}/>
                          :
                          <ProposalGraph stacked={true} data={data} components={components} height={500} animated={this.animateChart} unit={"kWh"}/>
                  )
                  :null;



        const proposalActions =
             (!readOnly)?
              <CardActions>
                <FlatButton label="Refresh" icon={<RefreshIcon/>} onClick={(e) => refreshProposal(e, proposal.id)} title={"Refresh current proposal"}/>
                <FlatButton label="Reprocess" icon={<RunIcon/>} onClick={(e) => reRunProposal(e, proposal.id)} title={"Reprocess current proposal"}/>
                <FlatButton label="Detail" icon={<DetailIcon/>} onClick={(e) => toggleDetail(e)} title={"Toggle detailed view"}/>
                <FlatButton label="Export" icon={<ExportIcon/>} onClick={(e) => exportProposal(e, proposal.id)} title={"Export Proposal to a XLS file"}/>
                <FlatButton label="Edit" icon={<EditIcon/>} disabled/>
                <FlatButton label="Duplicate" icon={<DuplicateIcon/>} onClick={(e) => duplicateProposal(e, proposal.id)} title={"Duplicate current proposal to a new one"}/>
                <FlatButton label="Delete" icon={<DeleteIcon/>} onClick={(e) => deleteProposal(e, proposal.id)} title={"Delete current proposal"}/>
              </CardActions>
            :
            null;


        const proposalDetail = (summary != null) && (detail_open == true) &&
		  <div>
			  {proposalActions}
			  <div style={styles.cardSeparator}>

				  <ProposalDetail
					  data={summary}
					  avg_info={{
						  'data': data,
						  'components': components,
					  }}
				  />
			  </div>
          </div>
        ;


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
	
			  <br/>

			  {proposalPicture}

			  <br/>

			  {proposalDetail}

			  {proposalActions}

            </Card>
        );

        return (
            <div>
                <Dialog
                  open={this.state.confirmation_open}
                  title={this.confirmation.title}
                  actions={this.confirmation.actionsButtons}
                  modal={false}
                  onRequestClose={this.handleCloseConfirmation}
                >
                    {this.confirmation.text}
                </Dialog>

                <Notification
                    message={this.props.message_text}
                    open={this.state.message_open}
                />

                <Proposal/>
            </div>
        );
    }
}

Proposal.propTypes = {
    readOnly: React.PropTypes.bool,
    proposalOld: React.PropTypes.bool,
};
