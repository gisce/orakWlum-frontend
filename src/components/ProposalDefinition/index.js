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

const styles = {
};

export class ProposalDefinition extends Component {
    constructor(props) {
      super(props);

      this.state = {
          loading: false,
          finished: false,
          stepIndex: 0,
          name: "",
          date_start: null,
          date_end: null,
          controlledDate: null,
      };
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
        console.log(this.state.date_end);
    };

    handleNext = () => {
        const {stepIndex} = this.state;
        if (!this.state.loading) {
            this.dummyAsync(() => this.setState({
                loading: false,
                stepIndex: stepIndex + 1,
                finished: stepIndex >= 1,
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
    switch (stepIndex) {
      case 0:
        return (
            <div>
                <p>We need some details to create a new Proposal.</p>
                <p>Please, <b>insert the name</b> of your proposal in the following field:</p>
                <TextField style={{marginTop: 0}} floatingLabelText="Proposal name" value={this.state.name} onChange={this.handleChangeName}/>
            </div>
        );
      case 1:
        return (
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
        );
      default:
        return 'Mmmm.... that\'s embracing...';
    }
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
          <p>Password change status</p>
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
            label={stepIndex === 1 ? 'Finish' : 'Next'}
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
          <Step>
            <StepLabel>Name</StepLabel>
          </Step>
          <Step>
            <StepLabel>Dates</StepLabel>
          </Step>
        </Stepper>
          {this.renderContent()}
      </div>
    );
  }
}

ProposalDefinition.propTypes = {
    open: React.PropTypes.bool,
};
