import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { SettingsSources } from '../SettingsSources'

import TextField from 'material-ui/TextField';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';

import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import ExpandTransition from 'material-ui/internal/ExpandTransition';
import DatePicker from 'material-ui/DatePicker';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';

import {Elementt} from '../Element'

import * as actionCreators from '../../actions/orakwlum';

const revalidator = require('revalidator');

const styles = {
    disclamer:{
        fontSize: 11,
        marginTop: 15,
        marginBottom: 15,
    },
};

const today = new Date();
const date_limit_inf = new Date(today.getFullYear() - 6, 1, 1);
const date_limit_sup = new Date(today.getFullYear() + 6, 12, 31);

const validations = {
    name: {
        description: 'Name of the New Element',
        type: 'string',
        minLength: 3,
        maxLength: 200,
        allowEmpty: false,
        required: true,
    },
    date_start: {
        description: 'Start Date of the New Element',
        type: 'date',
        allowEmpty: false,
        required: true,
    },
    date_end: {
        description: 'End Date of the New Element',
        type: 'date',
        allowEmpty: false,
        required: true,
    },
    aggregations: {
        description: 'Aggregations of the New Element',
        type: 'array',
        allowEmpty: false,
        required: true,
    },
    sources: {
        description: 'Sources of the New Element',
        type: 'array',
        allowEmpty: false,
        required: true,
    },
}

const types = {
    "proposal": {
        "name": "proposal",
        "plural": "proposals",
    },
    "historic": {
        "name": "historic",
        "plural": "historics",
    },
}

function mapStateToProps(state) {
    return {
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export class ElementDefinition extends Component {
    constructor(props) {
        super(props);

        let aggregations_list=[];
        let aggregations_list_complete=[];

        //initialize aggregations list
        for ( let [key, aggregation] of Object.entries(props.aggregationsList)) {
          aggregations_list.push( false );
          aggregations_list_complete.push( aggregation );
        }

        //initialize sources list
        let sources_list=[];
        let sources_all=[];
        let measures = [];
        for ( let [key, source] of Object.entries(props.sourcesList)) {
          if (source.active) {
              sources_all.push( source );
              sources_list.push( false );
          }
        }

        //handle default start date depending on the type
        const minDate = new Date();
        let createMethod = props.createElement;

        if (element_type == "historic") {
        minDate.setFullYear(minDate.getFullYear() - 1);
        createMethod = props.createHistoricProposal;
        }

        //const element_type = (props.type)?props.type:"proposal";
        const element_type = (props.defaultValue && 'type' in props.defaultValue ) ? props.defaultValue['type'] : "proposal";

        const element_start_date = (props.defaultValue && 'start_date' in props.defaultValue ) ? props.defaultValue['start_date'] : minDate;
        const element_end_date = (props.defaultValue && 'end_date' in props.defaultValue ) ? props.defaultValue['end_date'] : null;


        //handle passed name
        const element_name = (props.defaultValue && 'name' in props.defaultValue ) ? props.defaultValue['name'] : "";

        this.state = {
          createMethod: createMethod,
          type: types[element_type],
          element_type,
          loading: false,
          finished: false,
          stepIndex: 0,
          name: element_name,
          date_start: element_start_date,
          date_end: element_end_date,

          aggregations: aggregations_list,
          aggregations_all: aggregations_list_complete,

          sources: sources_list,
          sources_all: sources_all,

          name_validation: false,
          name_error_text: null,
          date_start_validation: false,
          date_start_error_text: null,
          date_end_validation: false,
          date_end_error_text: null,
          aggregations_validation: false,
          aggregations_error_text: null,
          sources_validation: false,
          sources_error_text: null,

          readyToNext: false,
        };

        this.stepsLength = this.getSteps().length;
    }


    componentWillMount = () => {
        //select all by default
        this.handleSources("all");
        this.handleAggregations("all");
    }

    componentDidMount = () => {
        //override the readyToNext=true setted indirectly by componentWillMount
        this.setState({
            readyToNext: true,
        });
    }

    getSteps = () => {
        const aggregationsList = this.state.aggregations_all;

        let aggregationsWithStatus = [];
        for (var i=0; i<aggregationsList.length; i++) {
            let agg = aggregationsList[i];

            aggregationsWithStatus.push(
                {
                    name:agg.name,
                    selected:this.state.aggregations[i],
                }
            );
        }

        const sourcesList = this.state.sources_all;

        let sourcesWithStatus = [];
        for (var i=0; i<sourcesList.length; i++) {
            let source = sourcesList[i];

            sourcesWithStatus.push(
                {
                    name:source.name,
                    selected:this.state.sources[i],
                }
            );
        }

        const proposalSummary = {
            name:this.state.name,
            aggregations:this.state.aggregationsNames,
            sources:this.state.sourcesNames,
            element_type: this.state.element_type,
            isNew: true,
            days_range: [
                this.state.date_start,
                (this.state.date_end)?this.state.date_end:this.state.date_start,
            ],
            status: {
              "color": "pending",
              "full": "Pending",
              "lite": "WIP"
            },
        }

        return [
            {
                key: "0",
                title: "Dates",
                content: (
                    <div>
                        <p>We need some details to create a new {this.state.type.name}.</p>

                        <SelectField
                            floatingLabelText="Element type"
                            value={this.state.element_type}
                            onChange={this.handleChangeElementType}
                        >
                            <MenuItem key={1} value={"proposal"} primaryText="Proposal" />
                            <MenuItem key={2} value={"historical"} primaryText="Historical" />
                        </SelectField>

                        <DatePicker
                            floatingLabelText="Start date"
                            hintText="Start date"
                            value={this.state.date_start}
                            onChange={this.handleChangeStartDate}
                            errorText={this.state.date_start_error_text}
                            autoOk={true}
                        />

                        <DatePicker
                            floatingLabelText="End date"
                            hintText="End date"
                            value={this.state.date_end}
                            onChange={this.handleChangeEndDate}
                            errorText={this.state.date_end_error_text}
                            autoOk={true}
                        />

                        <p style={styles.disclamer}>
                            * Dates are inclusive, so if you mark start:day1 and end:day2, will produce two elements, one for each day.
                        </p>
                    </div>
                )
            },

            {
                key: "1",
                title: "Name",
                content: (
                    <div>
                        <p>Perfect! Now insert the desired <b>range of dates</b>:</p>
                        <p>Please, <b>insert the name</b> of your {this.state.type.name} in the following field:</p>
                        <TextField
                            style={{marginTop: 0}}
                            floatingLabelText="Element name"
                            value={this.state.name}
                            onChange={this.handleChangeName}
                            errorText={this.state.name_error_text}
                        />
                    </div>
                )
            },

            {
                key: "2",
                title: "Aggregations",
                content: (
                    <div>
                        <p>Great! Now <b>select the aggregations</b> to perform:</p>
                        <Table
                            key={"aggregations_table"}
                            fixedHeader={true}
                            selectable={true}
                            multiSelectable={true}
                            onRowSelection={this.handleAggregations}
                        >
                            <TableHeader
                                displaySelectAll={false}
                                enableSelectAll={false}
                            >
                              <TableRow>
                                <TableHeaderColumn>Name</TableHeaderColumn>
                              </TableRow>
                            </TableHeader>

                            <TableBody
                                stripedRows={false}
                                deselectOnClickaway={false}
                            >
                        {
                            aggregationsWithStatus.map(function(agg, index) {
                                return (
                                    <TableRow key={"tableRow_"+index} selected={agg.selected}>
                                      <TableRowColumn>{agg.name}</TableRowColumn>
                                    </TableRow>
                                )
                            })
                        }
                            </TableBody>
                        </Table>

                    {
                            this.state.aggregations_error_text &&
                            <div>
                                <TextField
                                    id="aggregationError"
                                    style={{marginTop: 0}}
                                    floatingLabelText=""
                                    value=""
                                    errorText={this.state.aggregations_error_text}
                                />
                                <br/>
                                <br/>
                            </div>
                    }

                    </div>
                )
            },

            {
                key: "3",
                title: "Sources",
                content: (
                    <div>
                        <p>Finally <b>select the origins</b> to analyze:</p>

                            <Table
                                key={"sources_table"}
                                fixedHeader={true}
                                selectable={true}
                                multiSelectable={true}
                                onRowSelection={this.handleSources}
                            >
                                <TableHeader
                                    displaySelectAll={false}
                                    enableSelectAll={false}
                                >
                                  <TableRow>
                                    <TableHeaderColumn>Name</TableHeaderColumn>
                                  </TableRow>
                                </TableHeader>

                                <TableBody
                                    stripedRows={false}
                                    deselectOnClickaway={false}
                                >
                            {
                                sourcesWithStatus.map(function(source, index) {
                                    return (
                                        <TableRow key={"tableRow_sources"+index} selected={source.selected}>
                                          <TableRowColumn>{source.name}</TableRowColumn>
                                        </TableRow>
                                    )
                                })
                            }
                                </TableBody>
                            </Table>

                        {
                                this.state.sources_error_text &&
                                <div>
                                    <TextField
                                        id="sourceError"
                                        style={{marginTop: 0}}
                                        floatingLabelText=""
                                        value=""
                                        errorText={this.state.sources_error_text}
                                    />
                                    <br/>
                                    <br/>
                                </div>
                        }


                    </div>
                )
            },

            {
                key: "4",
                title: "Confirmation",
                content: (
                    <div>
                        <p>Amazing! Just one more step is needed, <b>review all the defined data</b> and confirm it:</p>

                        <br/><br/>

                        <Elementt
                            proposal={proposalSummary}
                            aggregations={this.state.aggregationsNames}
                            readOnly
                        />

                    </div>
                )
            },

        ];
    }

    dummyAsync = (cb) => {
        this.setState({loading: true}, () => {
            this.asyncTimer = setTimeout(cb, 500);
        });
    };

    validateField = (field, field_name, validations) => {
        const state_error_text = field_name + "_error_text";
        const state_validation = field_name + "_validation";


        if (field === '' || field.length == 0 || !field) {

            this.setState({
                [state_error_text]: null,
                [state_validation]: false,
            });
            return false;

        } else {
            const name_validation = revalidator.validate(field, validations);

            if (name_validation.valid) {
                this.setState({
                    [state_error_text]: null,
                    [state_validation]: true,
                    readyToNext: true,
                });
                return true;
            } else {
                this.setState({
                    [state_error_text]: field_name[0].toUpperCase() + field_name.slice(1) + " " + name_validation.errors[0].message,
                    [state_validation]: false,
                    readyToNext: false,
                });
                return false;
            }
        }
    }

    handleChangeName = (event, name) => {
        this.setState({
            name,
        });

        this.validateField({name: name}, "name", { properties: { name: validations.name} } );
    };

    handleChangeElementType = (event, index, element_type) => {
        this.setState({
            element_type,
        });
    };

    handleChangeStartDate = (event, date_start) => {
        const date_end = (this.state.date_end == null)? date_start : this.state.date_end;

        (this.state.date_end == null) &&
            this.setState({
                date_end,
            });

        this.setState({
            date_start,
            date_start_error_text: null,
        });

        const basicValidation = this.validateField({date_start: date_start}, "date_start", { properties: { date_start: validations.date_start} } );

        if (basicValidation) {
            if (date_start < date_limit_inf) {
                this.setState({
                    date_start_error_text: "Start date must be higher than " + date_limit_inf.toLocaleDateString("en"),
                    date_start_validation: false,
                    readyToNext: false,
                });
            }
            this.validateDatesRange(date_start, date_end);
        }
    };

    handleChangeEndDate = (event, date_end) => {
        const date_start = this.state.date_start;

        this.setState({
            date_end: date_end,
            date_end_error_text: null,
        });

        const basicValidation = this.validateField({date_end: date_end}, "date_end", { properties: { date_end: validations.date_end} } );

        if (basicValidation) {
            if (date_end > date_limit_sup) {
                this.setState({
                    date_end_error_text: "End date must be lower than " + date_limit_sup.toLocaleDateString("en"),
                    date_end_validation: false,
                    readyToNext: false,
                });
            } else
                this.validateDatesRange(date_start, date_end);
        }
    };

    validateDatesRange = (date_start, date_end) => {
        this.setState({
            date_end_error_text: null,
        });


        if (date_start == null) {
            this.setState({
                date_start_error_text: "Start date must be defined",
                date_end_validation: false,
                readyToNext: false,
            });
        }

        if (date_start > date_end) {
            this.setState({
                date_end_error_text: "End date must be >= the starting one",
                date_end_validation: false,
                readyToNext: false,
            });
        }
    }

    handleAggregations = (selectedRows) => {
        let aggregations_list = [];
        let aggregations_selected = [];
        const aggregationsAll = this.props.aggregationsList;

        //initialize list with all deselected
        Object.entries(aggregationsAll).map(function(agg, i){
            aggregations_list.push( false );
        });

        if (selectedRows == "all") {
            //mark all as selected
            Object.entries(aggregationsAll).map(function(agg, i){
                aggregations_list[i] =  true;
                aggregations_selected.push(i);
            });
            selectedRows = aggregations_list;
        }
        else {
            if (selectedRows != "none")
                //mark the selected ones
                selectedRows.map(function(agg, i){
                    aggregations_list[agg] = true;
                    aggregations_selected.push(agg);
                });
        }

        //Extract names to facilitate render of the summary
        let aggregationsNames = [];
        Object.entries(aggregationsAll).map( (agg,i) => {
            aggregations_list[i] && aggregationsNames.push(agg);
        });

        this.setState({
            aggregations: aggregations_list,
            aggregationsNames: aggregationsNames,
            aggregationsSelectedRows: aggregations_selected,
        });

        const basicValidation = this.validateField({aggregations: aggregations_list}, "aggregations_list", { properties: { aggregations: validations.aggregations} } );

        if (basicValidation) {
            // review that at least, one element is selected
            let anySelected = false;
            aggregations_list.map( (agg, i) => {
                    if (agg) anySelected=true;
                }
            );
            if (!anySelected) {
                this.setState({
                    aggregations_error_text: "Select at least one aggregation",
                    aggregations_validation: false,
                    readyToNext: false,
                });
            }
            else {
                this.setState({
                    aggregations_error_text: null,
                    aggregations_validation: true,
                    readyToNext: true,
                });
            }
        }
    }



    handleSources = (selectedRowsSources) => {
        let sources_list = [];
        let sources_selected = [];
        const sourcesAll = this.props.sourcesList;

        //initialize list with all deselected
        sourcesAll.map(function(agg, i){
            sources_list.push( false );
        });

        if (selectedRowsSources == "all") {
            //mark all as selected
            sourcesAll.map(function(agg, i){
                sources_list[i] =  true;
                sources_selected.push(i);
            });
            selectedRowsSources = sources_list;
        }
        else {
            if (selectedRowsSources != "none")
                //mark the selected ones
                selectedRowsSources.map(function(agg, i){
                    sources_list[agg] = true;
                    sources_selected.push(agg);
                });
        }

        //Extract names to facilitate render of the summary
        let sourcesNames = [];
        sourcesAll.map( (agg,i) => {
            sources_list[i] && sourcesNames.push(agg);
        });

        this.setState({
            sources: sources_list,
            sourcesNames: sourcesNames,
            sourcesSelectedRows: sources_selected,
        });

        const basicValidation = this.validateField({sources: sources_list}, "sources_list", { properties: { sources: validations.sources} } );

        if (basicValidation) {
            // review that at least, one element is selected
            let anySelected = false;
            sources_list.map( (agg, i) => {
                    if (agg) anySelected=true;
                }
            );

            if (!anySelected) {
                this.setState({
                    sources_error_text: "Select at least one source",
                    sources_validation: false,
                    readyToNext: false,
                });
            }
            else {
                this.setState({
                    sources_error_text: null,
                    sources_validation: true,
                    readyToNext: true,
                });
            }
        }
    }

    // auxiliar method responsible of validate the next step (for x -> prev -> next flows)
    validateNext = (index) => {
        let x = event;
        switch(index) {
            case 0:
                this.handleChangeName(x, this.state.name);
                break;

            case 1:
                if (this.state.date_start && this.state.date_end) {
                    this.handleChangeStartDate(x, this.state.date_start);
                    this.handleChangeEndDate(x, this.state.date_end);
                }
                break;

            case 2:
                this.handleAggregations(this.state.aggregationsSelectedRows);
                break;
            case 3:
                this.handleSources(this.state.sourcesSelectedRows);
                break;
        }
    }


    handleNext = () => {
        const {stepIndex} = this.state;
        const max = this.stepsLength - 1;

        if (!this.state.loading) {
            this.setState({
                loading: false,
                stepIndex: stepIndex + 1,
                finished: stepIndex >= max,
                readyToNext: false,
                readyToNextPrev: true,
            });
        }

        this.validateNext(stepIndex + 1);
    };

    handlePrev = () => {
        const {stepIndex} = this.state;

        if (!this.state.loading) {
            this.dummyAsync(() => this.setState({
                loading: false,
                stepIndex: stepIndex - 1,
                readyToNext: this.state.readyToNextPrev,
            }));
        }
    };

    getStepContent(stepIndex) {
        return (stepIndex < this.stepsLength)?
           this.getSteps()[stepIndex].content
           :
           'Mmmm.... that\'s embracing...';
    }

    renderContent() {
        const {finished, stepIndex, readyToNext} = this.state;
        const contentStyle = {margin: '0 16px', overflow: 'hidden'};

        if (finished) {
            return (
                <div style={contentStyle}>
                  <p>
                    <a
                      href="#"
                      onClick={(event) => {
                        event.preventDefault();
                        this.setState({stepIndex: 0, finished: false});
                      }}
                    >
                      Change again
                    </a>.
                  </p>
                  <p>Create new proposal status</p>
                </div>
            );
        }

        return (
          <div style={contentStyle}>
            <div>{this.getStepContent(stepIndex)}</div>
            <div style={{marginTop: 24, marginBottom: 12}}>
              <FlatButton
                label="Back"
                disabled={stepIndex === 0}
                onTouchTap={this.handlePrev}
                style={{marginRight: 12}}
              />


        {   (stepIndex === this.stepsLength-1)?
              <RaisedButton
                label='Create'
                primary={true}
                onTouchTap={(e) => this.createNewProposal(e)}
                disabled={!readyToNext && stepIndex !== this.stepsLength-1}
              />
          :
              <RaisedButton
                label='Next'
                primary={true}
                onTouchTap={this.handleNext}
                disabled={!readyToNext && stepIndex !== this.stepsLength-1}
              />
        }
            </div>
          </div>
        );
    }

    createNewProposal (event) {
        console.debug("Creating new Element");

        //Ensure 00:00:00 of each day
        let date_start = this.state.date_start;
        date_start.setHours(0, 0, 0, 0);

        let date_end;
        date_end = (this.state.date_end)?this.state.date_end:this.state.date_start;
        date_end.setHours(0, 0, 0, 0);

        const proposalData = {
            name:this.state.name,
            aggregations:this.state.aggregationsNames,
            sources:this.state.sourcesNames,
            element_type: this.state.element_type,
            isNew: true,
            days_range: [
                date_start,
                (this.state.date_end)?this.state.date_end:this.state.date_start,
            ],
            status: {
              "color": "pending",
              "full": "Pending",
              "lite": "WIP"
            },
        }

        console.debug("data", proposalData);
        this.state.createMethod(proposalData);
    }

    render() {
        const {loading, stepIndex, readyToNext} = this.state;
        const steps = this.getSteps();

        return (
          <div style={{width: '100%', maxWidth: 700, margin: 'auto'}}>
            <Stepper activeStep={stepIndex}>
                {steps.map(function(step, index) {
                    return (
                        <Step key={"step"+step.key}>
                            <StepLabel key={"stepLabel"+step.key}>{step.title}</StepLabel>
                        </Step>
                    )
                })}
            </Stepper>
              {this.renderContent()}
          </div>
        );
    }
}

ElementDefinition.propTypes = {
    open: PropTypes.bool,
    aggregationsList: PropTypes.object,
    sourcesList: PropTypes.array,
    defaultValue: PropTypes.object,
};
