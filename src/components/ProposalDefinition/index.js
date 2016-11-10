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

const styles = {
};

const aggregations = [
    {
        name: 'Agg A',
        id: '0001',
    },
    {
        name: 'Agg B',
        id: '0002',
    },
    {
        name: 'Agg C',
        id: '0003',
    },
]

export class ProposalDefinition extends Component {
    constructor(props) {
      super(props);

      this.state = {
          loading: false,
          finished: false,
          stepIndex: 2,
          name: "",
          date_start: null,
          date_end: null,
          controlledDate: null,
      };

      this.steps = [
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
                          <TableHeader>
                            <TableRow>
                              <TableHeaderColumn>Name</TableHeaderColumn>
                            </TableRow>
                          </TableHeader>

                          <TableBody
                              deselectOnClickaway={false}
                              stripedRows={true}
                          >
                          {
                              aggregations.map(function(agg, index) {
                                  return (
                                      <TableRow key={"tableRow_"+index}>
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
                  </div>
              )
          },

      ];
    }

    handleRowSelection = (selectedRows) => {
        let aggregations_list = [];

        if (selectedRows == "all") {
            console.dir(selectedRows);
            aggregations.map(function(agg, i){
                aggregations_list.push( agg.id );
            });
        } else {
            selectedRows.map(function(row, i){
                aggregations_list.push( aggregations[row].id );
            });
        }

        this.setState({
            aggregations: aggregations_list,
        });
    }

    dummyAsync = (cb) => {
        this.setState({loading: true}, () => {
            this.asyncTimer = setTimeout(cb, 500);
        });
    };

    handleChangeName = (event, name) => {
        //validate name
        this.setState({
            name: name,
        });
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
        const max = this.steps.length - 1;

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
      return (stepIndex < this.steps.length)?
           this.steps[stepIndex].content
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
            label={stepIndex === this.steps.length-1 ? 'Create' : 'Next'}
            primary={true}
            onTouchTap={this.handleNext}
          />
        </div>
      </div>
    );
  }

  render() {
    const {loading, stepIndex} = this.state;

    return (
      <div style={{width: '100%', maxWidth: 700, margin: 'auto'}}>
        <Stepper activeStep={stepIndex}>
            {this.steps.map(function(step, index) {
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
