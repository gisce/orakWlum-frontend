import React, { Component } from 'react'

import TextField from 'material-ui/TextField';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';

import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import ExpandTransition from 'material-ui/internal/ExpandTransition';
import Divider from 'material-ui/Divider';
import DatePicker from 'material-ui/DatePicker';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

import {Proposal} from '../Proposal'

const styles = {
};

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
          stepIndex: 3,
          name: "Xav",
          date_start: null,
          date_end: null,
          aggregations: aggregations_list,
          aggregations_all: props.aggregationsList,
      };
      this.stepsLength = this.getSteps().length;
    }

    componentDidMount = () => {
        //select all by default
        this.handleRowSelection("all");
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
            "creation_date": "Fri, 11 Nov 2016 13:28:33 GMT",
            "days_range": [
              "2017-09-03",
              "2017-09-06"
            ],

        }

        return [
            {
                key: "0",
                title: "Name",
                content: (
                    <div>
                        <p>We need some details to create a new Proposal.</p>
                        <p>Please, <b>insert the name</b> of your proposal in the following field:</p>
                        <TextField style={{marginTop: 0}} floatingLabelText="Proposal name" value={this.state.name} onChange={this.handleChangeName}/>
                    </div>
                )
            },
            {
                key: "1",
                title: "Dates",
                content: (
                    <div>
                        <p>Perfect! Now insert the desired <b>range of dates</b>:</p> {this.state.name}

                        <DatePicker
                            floatingLabelText="Start date"
                            hintText="Start date"
                            value={this.state.date_start}
                            onChange={this.handleChangeStartDate}
                        />

                        <DatePicker
                            floatingLabelText="End date"
                            hintText="End date"
                            value={this.state.date_end}
                            onChange={this.handleChangeEndDate}
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
                            onRowSelection={this.handleRowSelection}
                        >
                            <TableHeader
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

                        <Proposal proposal={proposalSummary} readOnly/>

                        <TextField disabled={true} style={{marginTop: 0}} floatingLabelText="Name" value={this.state.name}/>

                        <br/><br/>

                        <DatePicker
                            floatingLabelText="Start date"
                            hintText="Start date"
                            value={this.state.date_start}
                            disabled={true}
                        />

                        <DatePicker
                            floatingLabelText="End date"
                            hintText="End date"
                            value={this.state.date_end}
                            disabled={true}
                        />

                        <br/>
                        <TextField disabled={true} style={{marginTop: 0}} floatingLabelText="Aggregations" value={this.state.aggregationsNames}/>

                    </div>
                )
            },

        ];
    }

    handleRowSelection = (selectedRows) => {
        let aggregations_list = [];
        const aggregationsAll = this.props.aggregationsList;

        //initialize list with all deselected
        aggregationsAll.map(function(agg, i){
            aggregations_list.push( false );
        });

        if (selectedRows == "all") {
            //mark all as selected
            aggregationsAll.map(function(agg, i){
                aggregations_list[i] =  true;
            });
            selectedRows = aggregations_list;
        }
        else {
            if (selectedRows != "none")
                //mark the selected ones
                selectedRows.map(function(agg, i){
                    aggregations_list[agg] = true;
                });
        }

        //Extract names to facilitate render of the summary
        let aggregationsNames = [];
        aggregationsAll.map( (agg,i) => {
            aggregations_list[i] && aggregationsNames.push(agg.name);
        });

        this.setState({
            aggregations: aggregations_list,
            aggregationsNames: aggregationsNames,
        });
    }

    dummyAsync = (cb) => {
        this.setState({loading: true}, () => {
            this.asyncTimer = setTimeout(cb, 500);
        });
    };

    handleChangeName = (event, name) => {
        console.log("changing name", name);
        //validate name
        this.setState({
            name: name,
        });
        console.log(this.state.name);

    };

    handleChangeStartDate = (event, date_start) => {
        //validate date
        this.setState({
            date_start: date_start,
        });
    };

    handleChangeEndDate = (event, date_end) => {
        //validate date
        this.setState({
            date_end: date_end,
        });
    };

    handleNext = () => {
        const {stepIndex} = this.state;
        const max = this.stepsLength - 1;

        if (!this.state.loading) {
            this.dummyAsync(() => this.setState({
                loading: false,
                stepIndex: stepIndex + 1,
                finished: stepIndex >= max,
            }));
        }
    };

    handlePrev = () => {
        const {stepIndex} = this.state;
        if (!this.state.loading) {
            this.dummyAsync(() => this.setState({
                loading: false,
                stepIndex: stepIndex - 1,
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
    const {finished, stepIndex} = this.state;
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
          <RaisedButton
            label={stepIndex === this.stepsLength-1 ? 'Create' : 'Next'}
            primary={true}
            onTouchTap={this.handleNext}
          />
        </div>
      </div>
    );
  }

  render() {
    const {loading, stepIndex} = this.state;

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
