import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import {orange300, orange900, green300, green900, red300, red900} from 'material-ui/styles/colors';

import Toggle from 'material-ui/Toggle';

import * as actionCreators from '../../actions/orakwlum';

import { Tag } from '../Tag';

import { ElementGraph } from '../ElementGraph';
import { ElementTable } from '../ElementTable';
import { ElementDetail } from '../ElementDetail';
import { ElementDefinition } from '../ElementDefinition';
import { ElementTableEditable } from '../ElementTableEditable';

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
import ElementIcon from 'material-ui/svg-icons/image/switch-camera';
import TuneIcon from 'material-ui/svg-icons/editor/border-all';

import {adaptProposalData} from '../../utils/graph';
import {capitalize} from '../../utils/misc';

import { localized_time, day_format, parse_day_format } from '../../constants'

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
        userName: state.auth.userName,
        isAuthenticated: state.auth.isAuthenticated,
        sources: state.orakwlum.sources,
        aggregations_from_state: state.orakwlum.aggregations,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export class Elementt extends Component {
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

        this.edit_open = false;
        this.tune_open = false;

        props.aggregations[0].selected = true;

        if (props.comparation){
            this.edit_open = false;
            this.tune_open = false;
            this.detail_open = true;
            this.comparation = true;
        }



        // Prepare data sets
        console.log("CONSTRUEIXO ELEMENT");
        const { prediction } = props.proposal;
        const { aggregations } = props;

        // Adapted data by aggregationId
        this.data = {}
        this.average = {}
        this.components = {}

        if (prediction && Object.keys(prediction).length > 0) {

            for ( let [key, an_agg] of Object.entries(aggregations)) {
                const current_agg_id = an_agg.id;

                //The Prediction of current aggregation
                const predictionAdapted=adaptProposalData(prediction['result']);
                const current = predictionAdapted[current_agg_id];

                this.data[current_agg_id] = current.result;
                this.average[current_agg_id] = current.average;
                this.components[current_agg_id] = current.components;
            };

            this.summary = (prediction.summary != undefined)?prediction.summary:null;
        }
    }

    dummyAsync = (cb) => {
        this.setState({loading: true}, () => {
            this.asyncTimer = setTimeout(cb, 2000);
        });
    };

    applyTunedChanges = (changes, difference) => {
        console.log("PARENT", difference)

        console.log(this.data[this.state.aggregationSelected]);

        // For each difference
        for ( let [hour_position, hour_difference] of Object.entries(difference)) {

            // Apply it for all available aggregations in computed data
            for ( let [agg_key, an_agg] of Object.entries(this.props.aggregations)) {
                //if (currentAgg) -> skip
                const current_agg_id = an_agg.id;
                this.data[current_agg_id][hour_position]["tuned"] += hour_difference
                this.data[current_agg_id][hour_position]["total"] += hour_difference
            }
        }

        //this.changed_data = changes;
    }

    toogleElementRender = (event, status) => {
        this.setState({
            proposalTable: status,
            message_open: false,
        });
        this.animateChart = false;
    };

    changeElementAggregation = (event, agg) => {
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

    refreshElementQuestion = (event, proposalID) => {
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
            onTouchTap={() => this.refreshElement(proposalID)}
          />,
        ];

        this.confirmation.title = "Refresh current proposal";
        this.confirmation.text = <div><p>The Element will be refreshed fetching the last changes at DB. Unsaved changes will be discarted.</p><p>Are you sure about to <b>refresh this Element</b>?</p></div>;
        this.confirmation.actionsButtons = actionsButtons;

        this.setState({
            message_open: false,
            confirmation_open: true,
        });

    };

    refreshElement = (proposalID) => {
        this.setState({
            confirmation_open: false,
        });
        this.animateChart = false;

        this.props.fetchElements(proposalID);

        this.setState({
            message_open: true,
        });

        this.animateChart = true;
    };




    reRunElementQuestion = (event, proposalID) => {
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
            onTouchTap={() => this.reRunElement(proposalID)}
          />,
        ];

        this.confirmation.title = "Reprocess current Element";
        this.confirmation.text = <div><p>The Element will be reprocessed using the last data on DB. It can take a few seconds...</p><p>Are you sure about to <b>reprocess this Element</b>?</p></div>;
        this.confirmation.actionsButtons = actionsButtons;

        this.setState({
            message_open: false,
            confirmation_open: true,
        });

        this.animateChart = false;
    };

    reRunElement = (proposalID) => {
        this.animateChart = false;
        this.setState({
            message_open: true,
            confirmation_open: false,
        });

        this.props.runElement(proposalID);

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



    toggleEdit = () => {
        this.edit_open = !this.edit_open;

        this.animateChart = false;

        this.setState({
            edit_open: this.edit_open,
        });
    };




    toggleTune = () => {
        this.tune_open = !this.tune_open;

        this.animateChart = false;

        this.setState({
            tune_open: this.tune_open,
        });
    };



    duplicateElementQuestion = (event, proposalID) => {
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
            onTouchTap={() => this.duplicateElement(proposalID)}
          />,
        ];

        this.confirmation.title = "Duplicate current Element";
        this.confirmation.text = <div><p>The Element will be duplicated. The consumptions will not be reprocessed, if needed "Run" the new Element once it's cloned.</p><p>Are you sure about to <b>duplicate this Element</b>?</p></div>;
        this.confirmation.actionsButtons = actionsButtons;

        this.animateChart = false;
        this.setState({
            message_open: false,
            confirmation_open: true,
        });
    };

    duplicateElement = (proposalID) => {
        this.animateChart = false;
        this.setState({
            message_open: true,
            confirmation_open: false,
        });
        this.props.duplicateElement(proposalID);
    };

    deleteElementQuestion = (event, proposalID) => {
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
            onTouchTap={() => this.deleteElement(proposalID)}
          />,
        ];

        this.confirmation.title = "Delete current Element";
        this.confirmation.text = <div><p>The Element will be deleted. This process can't be undone...</p><p>Are you sure about to <b>delete this Element</b>?</p></div>;
        this.confirmation.actionsButtons = actionsButtons;

        this.animateChart = false;
        this.setState({
            message_open: false,
            confirmation_open: true,
        });
    };

    deleteElement = (proposalID) => {
        this.animateChart = false;
        this.setState({
            message_open: true,
            confirmation_open: false,
        });
        const token = this.props.token;
        this.props.deleteElement(token, proposalID);
    };

    exportElement = (event, proposalID) => {
        event.preventDefault();

        this.setState({
            animateChart: false,
            message_text: "Exporting current proposal",
            confirmation_open: false,
        });

        this.props.exportElement(proposalID);
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

        const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

        const lastExecution = new Date(proposal.execution_date * 1000).toLocaleString(locale, hourOptions);
        const creationDate = new Date(proposal.creation_date * 1000).toLocaleString(locale, hourOptions);
        const updateDate = new Date(proposal.update_date * 1000).toLocaleString(locale, hourOptions);

        const ownerText = (proposal.owner)?"by " + proposal.owner:"";

        const withPicture = (proposal.isNew)?!proposal.isNew:true;

        const element_type = (proposal.element_type)?proposal.element_type:"Unknown";

        //Define the start and end dates
        const start_date = (proposal.days_range.length > 0)? localized_time(proposal.days_range[0], parse_day_format): null;
        const end_date = (proposal.days_range.length > 1)? localized_time(proposal.days_range[0], parse_day_format) : start_date;

        const start_date_past = (!historical)? localized_time(proposal.days_range_past[0], parse_day_format): null;
        const end_date_past = (!historical)? ((proposal.days_range_past.length > 1)? localized_time(proposal.days_range_past[0], parse_day_format) : start_date_past):null;

        /// Process Element dates
        const proposalDaysRange = (proposal.days_range)? proposal.days_range : [];
        const proposalDaysRangePast = (proposal.days_range_past)? proposal.days_range_past : proposalDaysRange;

        const daysRangeString =
            (proposalDaysRange.length == 1)?
                "" + start_date.format(day_format)
                :
                "" + start_date.format(day_format) + " - " + end_date.format(day_format);

        const daysRangeStringPastString =
            (!historical)?
                (
                    (proposalDaysRangePast.length == 1)?
                        "" + start_date_past.format(day_format)
                        :
                        "" + start_date_past.format(day_format) + " - " + end_date_past.format(day_format)
                )
                : "";

        const dayOfElement = start_date.toDate().getDay();
        const dayOfElementPast = (historical) ? null : start_date_past.toDate().getDay();


        const title_type = (element_type == "concatenation" || element_type == "comparation")?"":capitalize(element_type);
        const title = <span>{title_type} {proposal.name}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[{daysRangeString}]</span>
        const subtitle = <span>Using {days[dayOfElement]} {daysRangeStringPastString}</span>;

        const offset = (withPicture)?0:1;
        const size = (withPicture)?8:9;

        const prediction = proposal.prediction;

        const aggregationSelected = this.state.aggregationSelected;
        const changeElementAggregation=this.changeElementAggregation;
        const aggregations = this.state.aggregations;

        const refreshElement = this.refreshElementQuestion;
        const reRunElement = this.reRunElementQuestion;
        const duplicateElement = this.duplicateElementQuestion;
        const deleteElement = this.deleteElementQuestion;
        const exportElement = this.exportElement;

        const {detail_open, edit_open, tune_open, toggleDetail, toggleEdit, toggleTune} = this;

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



        // The Element status!
        const proposalStatus = (
            proposal.status &&
            <div className={"col-md-2 col-lg-2"} style={styles.wrapper}>
                <Tag tag={proposal.status} />
            </div>
        )


        // The Element Aggregations List
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
                            <div key={"aggregationDivTag_"+i} onClick={(e) => changeElementAggregation(e, agg)}>
                                 <Tag
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


        // The Element graph toogle! //to switch between table and chart
        const proposalPictureToggle = (
            (withPicture) && (!this.comparation) &&
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
                          onToggle={this.toogleElementRender}
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
                          onToggle={this.toogleElementRender}
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


        const adaptedElement = Object.assign({}, proposal, {
            start_date: start_date.toDate(),
            end_date: end_date.toDate(),
        })

/*
    SmartTable adaption!
        const proposalTuneHeaders = Object.keys(components).map(function( component, index){
            return {
                title: component,
                width: null,
            }
        });

        const proposalTuneData = Object.keys(data).map(function( hour, index){
            return Object.keys(components).map(function( component, indexComp){
                  return data[hour][component];
            });
        });
  */


        let proposalPicture;

        // Handle EDIT
        if (edit_open) {
            const proposalEdit =
    		      <div>
                  <ElementDefinition
                      aggregationsList={this.props.aggregations}
                      sourcesList={this.props.sources.measures}
                      defaultValue={adaptedElement}
                      editMode={true}
                      endingParentMethod={() => this.toggleEdit()}
                  />
              </div>
            ;

            proposalPicture = proposalEdit;
        }

        // Handle TUNE
        else if (tune_open) {
              const proposalTuneHeaders = Object.keys(this.components[aggregationSelected]).map(function( component, index){
                  return {
                      key: component,
                      name: component,
                      editable: true,
                      resizable: true,
                  }
              });

              const hour_column = {
                  key: 'day_string',
                  name: 'Hour',
                  editable: false,
                  width: 75,
                  resizable: true,
                  sortable: false,
              };

              const proposalTune =
                <div>
                    <ElementTableEditable
                        header={[ hour_column, ...proposalTuneHeaders]}
                        data={this.data[aggregationSelected]}
                        parentDataHandler={(changes, difference) => this.applyTunedChanges(changes, difference)}
                    />
                </div>
              ;

              proposalPicture = proposalTune;


        // Handle PICTURE
        } else {
            if (withPicture && prediction && Object.keys(prediction).length > 0)
                proposalPicture = (proposalTable)?
                    <ElementTable stacked={true} data={this.data[aggregationSelected]} components={this.components[aggregationSelected]} height={500} unit={"kWh"}/>
                    :
                    <ElementGraph stacked={true} data={this.data[aggregationSelected]} components={this.components[aggregationSelected]} height={500} animated={this.animateChart} unit={"kWh"}/>
        }

        const disableDetail = (element_type == "concatenation")?true:false;
        const disableExport = (element_type == "comparation")?true:false;

        const proposalActions =
             (!readOnly && !this.comparation)?
              <CardActions>
                <FlatButton label="Refresh" icon={<RefreshIcon/>} onClick={(e) => refreshElement(e, proposal.id)} title={"Refresh current proposal"}/>
                <FlatButton label="Process" icon={<RunIcon/>} onClick={(e) => reRunElement(e, proposal.id)} title={"Reprocess current proposal"}/>
                <FlatButton label="Detail" icon={<DetailIcon/>} onClick={(e) => toggleDetail(e)} title={"Toggle detailed view"} disabled={disableDetail}/>
                <FlatButton label="Edit" icon={<EditIcon/>} onClick={(e) => toggleEdit(e)} title={"Toggle edit view"}/>
                <FlatButton label="Tune" icon={<TuneIcon/>} onClick={(e) => toggleTune(e)} title={"Toggle tune view"}/>
                <FlatButton label="Export" icon={<ExportIcon/>} onClick={(e) => exportElement(e, proposal.id)} title={"Export Element to a XLS file"} disabled={disableExport}/>
                <FlatButton label="Duplicate" icon={<DuplicateIcon/>} onClick={(e) => duplicateElement(e, proposal.id)} title={"Duplicate current proposal to a new one"}/>
                <FlatButton label="Delete" icon={<DeleteIcon/>} onClick={(e) => deleteElement(e, proposal.id)} title={"Delete current proposal"}/>

            {
                (proposal.related_id)?
                <FlatButton label="Historical" icon={<ElementIcon/>} href={"/historicals/" + proposal.related_id} title={"Switch to related historical"}/>
                :
                <FlatButton disabled label="Historical" title={"Switch to related historical"}/>
            }
            </CardActions>
            :
            null;

        const proposalDetail = (this.summary != null) && (detail_open == true) &&
    		  <div>
    			  {proposalActions}
    			  <div style={styles.cardSeparator}>

    				  <ElementDetail
    					  data={this.summary}
    					  avg_info={{
                              'average': this.average[aggregationSelected],
    						  'data': this.data[aggregationSelected],
    						  'components': this.components[aggregationSelected],
    					  }}
    				  />
    			  </div>
          </div>
        ;

        // The resulting Element element
        const Element = () => (
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
          {
              proposal.creation_date &&
                  <p><span>Element was created on {creationDate} {ownerText}</span></p>
          }
          {
              proposal.execution_date &&
                  <p><span>Last execution was performed at {lastExecution}</span></p>
          }
          {
              proposal.update_date &&
                  <p><span>Last update was applied at {updateDate}</span></p>
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

                <Element/>
            </div>
        );
    }
}

Elementt.propTypes = {
    readOnly: PropTypes.bool,
    proposalOld: PropTypes.bool,
    comparation: PropTypes.bool,
};
