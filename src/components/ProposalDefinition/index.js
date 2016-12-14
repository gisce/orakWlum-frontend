import React, { Component } from 'react';

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

import {Proposal} from '../Proposal'

import {createProposal} from '../../actions/proposal';

const revalidator = require('revalidator');

const styles = {
};

const today = new Date();
const date_limit_inf = new Date(today.getFullYear() - 4, 1, 1);
const date_limit_sup = new Date(today.getFullYear() + 4, 12, 31);

const validations = {
    name: {
        description: 'Name of the New Proposal',
        type: 'string',
        minLength: 3,
        maxLength: 200,
        allowEmpty: false,
        required: true,
    },
    date_start: {
        description: 'Start Date of the New Proposal',
        type: 'date',
        allowEmpty: false,
        required: true,
    },
    date_end: {
        description: 'End Date of the New Proposal',
        type: 'date',
        allowEmpty: false,
        required: true,
    },
    aggregations: {
        description: 'Aggregations of the New Proposal',
        type: 'array',
        allowEmpty: false,
        required: true,
    },
}


export class ProposalDefinition extends Component {
    constructor(props) {
      super(props);

      let aggregations_list=[];

      //initialize list
      props.aggregationsList.map(function(agg, i){
          aggregations_list.push( false );
      });

      this.state = {
          loading: false,
          finished: false,
          stepIndex: 0,
          name: "",
          date_start: null,
          date_end: null,
          aggregations: aggregations_list,
          aggregations_all: props.aggregationsList,
          name_validation: false,
          name_error_text: null,
          date_start_validation: false,
          date_start_error_text: null,
          date_end_validation: false,
          date_end_error_text: null,
          aggregations_validation: false,
          aggregations_error_text: null,
          readyToNext: false,
      };
      this.stepsLength = this.getSteps().length;
    }

    componentWillMount = () => {
        //select all by default
        this.handleAggregations("all");
    }

    componentDidMount = () => {
        //override the readyToNext=true setted indirectly by componentWillMount
        this.setState({
            readyToNext: false,
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


        const proposalSummary = {
            name:this.state.name,
            aggregations:this.state.aggregationsNames,
            isNew: true,
            days_range: [
                this.state.date_start,
                this.state.date_end,
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
                title: "Name",
                content: (
                    <div>
                        <p>We need some details to create a new Proposal.</p>
                        <p>Please, <b>insert the name</b> of your proposal in the following field:</p>
                        <TextField
                            style={{marginTop: 0}}
                            floatingLabelText="Proposal name"
                            value={this.state.name}
                            onChange={this.handleChangeName}
                            errorText={this.state.name_error_text}
                        />
                    </div>
                )
            },
            {
                key: "1",
                title: "Dates",
                content: (
                    <div>
                        <p>Perfect! Now insert the desired <b>range of dates</b>:</p>

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
                title: "Confirmation",
                content: (
                    <div>
                        <p>Amazing! Just one more step is needed, <b>review all the defined data</b> and confirm it:</p>

                        <br/><br/>

                        <Proposal
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
            name: name,
        });

        this.validateField({name: name}, "name", { properties: { name: validations.name} } );
    };

    handleChangeStartDate = (event, date_start) => {
        const date_end = (this.state.date_end == null)? date_start : this.state.date_end;
        (this.state.date_end == null) &&
            this.setState({
                date_end: date_end,
            });

        this.setState({
            date_start: date_start,
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
        aggregationsAll.map(function(agg, i){
            aggregations_list.push( false );
        });

        if (selectedRows == "all") {
            //mark all as selected
            aggregationsAll.map(function(agg, i){
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
        aggregationsAll.map( (agg,i) => {
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
                onTouchTap={this.createNewProposal}
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

    createNewProposal () {
        console.log("create");
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

ProposalDefinition.propTypes = {
    open: React.PropTypes.bool,
};
