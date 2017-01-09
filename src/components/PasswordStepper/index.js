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

const revalidator = require('revalidator');

const styles = {
  dialog: {
      width: '80%',
      maxWidth: 'none',
  },
  ok: {
      color: 'green',
  },
  ko: {
      color: 'red',
  },
  withoutBullet: {
      listStyleType: "none",
  },
};

const PASSWD_MIN = 6;
const PASSWD_MAX = 80;
const validations = {
    passwd: {
        description: 'New password',
        type: 'string',
        minLength: PASSWD_MIN,
        maxLength: PASSWD_MAX,
        allowEmpty: false,
        required: true,
    },
};

export class PasswordStepper extends Component {
  //main checks indicators
  okCheck = <span style={styles.ok}>&#10004;</span>;
  koCheck = <span style={styles.ko}>&#10008;</span>;

  //list checks indicators
  okSubCheck = <span>&#9745;</span>;
  koSubCheck = <span>&#9744;</span>;

  state = {
    loading: false,
    finished: false,
    stepIndex: 0,
    validSize: this.koCheck,
    validPasswdCombi: this.koCheck,
    validUpper: this.koSubCheck,
    validSymbol: this.koSubCheck,
    validNumber: this.koSubCheck,
  };

  passwd = {
      p1: null,
      p2: null,
  }

  dummyAsync = (cb) => {
    this.setState({loading: true}, () => {
      this.asyncTimer = setTimeout(cb, 500);
    });
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

  validateUpper = (passwd)  => {
      if (!passwd.match(/^.*[A-Z]+.*$/)){
          this.setState({
              new_passwd_error_text: "New password must have at least one number, UPPER or a symbol",
              validUpper: this.koSubCheck,
          });
          return false;
      }
      this.setState({
          validPasswdCombi: this.okCheck,
          validUpper: this.okSubCheck,
      })
      return true;
  }

  validateLower = (passwd)  => {
      if (!passwd.match(/^.*[a-z]+.*$/)){
          this.setState({
              new_passwd_error_text: "New password must have at least one lower character",
              validPasswdCombi: this.koCheck,
          });
          return false;
      }
      return true;
  }

  validateNumber = (passwd)  => {
      if (!passwd.match(/^.*[0-9]+.*$/)){
          this.setState({
              new_passwd_error_text: "New password must have at least a lower",
              validNumber: this.koSubCheck,
          });
          return false;
      }
      this.setState({
          validPasswdCombi: this.okCheck,
          validNumber: this.okSubCheck,
      })
      return true;
  }

  validateSymbol = (passwd)  => {
      if (!passwd.match(/^.*[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]+.*$/)){
          this.setState({
              new_passwd_error_text: "New password must have at least one number, UPPER or a symbol",
              validSymbol: this.koSubCheck,
          });
          return false;
      }
      this.setState({
          validPasswdCombi: this.okCheck,
          validSymbol: this.okSubCheck,
      })
      return true;
  }

  validateSame = (passwd1, passwd2)  => {
      if (passwd1 != passwd2) {
          this.setState({
              new_passwd_error_text: "New passwords do not match",
          });
          return false;
      }
      return true;
  }


  validateNewPasswd = (passwd1, passwd2) => {
      const passwd_validation = revalidator.validate({ name: passwd1}, { properties: { name: validations.passwd} } );

      //dispatch tests to upgrade indicators
      const isLower = this.validateLower(passwd1);
      const areEqual = this.validateSame(passwd1, passwd2);
      const isSymbol = this.validateSymbol(passwd1);
      const isNumber = this.validateNumber(passwd1);
      const isUpper = this.validateUpper(passwd1);

      //(UPPER or numb3r or a symbol)
      const passwdCombi = (isUpper || isNumber || isSymbol) ? true : false;

      // Indicators of check Size and Policy Accomplishment
      this.setState({
        //validate size
        validSize: (passwd_validation.valid)?
            this.okCheck
            :
            this.koCheck,
        //validate policy
        validPasswdCombi: (passwdCombi)?
            this.okCheck
            :
            this.koCheck,
        });

        // check if password is correct //retriggering tests in order ((UPPER, n1mb3r, symbol) AND same)
        if (passwd_validation.valid) {
             if (
                 (this.validateUpper(passwd1) || this.validateNumber(passwd1) || this.validateSymbol(passwd1))
                  && this.validateSame(passwd1, passwd2)) {
                this.setState({
                    new_passwd_error_text: null,
                    new_passwd_validation: true,
                    readyToNext: true,
                });
                return true;
            }
            else {
                this.setState({
                    readyToNext: false,
                });
                return false;
            }
        }
        else {
            this.setState({
              new_passwd_error_text: "New password " + passwd_validation.errors[0].message,
              new_passwd_validation: false,
              readyToNext: false,
            });
            return false;
        }

  }

  handleChangeNewPasswd = (passwd1, passwd2) => {
      this.validateNewPasswd(passwd1, passwd2);
  };

  handleChangeNewPasswd1 = (event, new_passwd) => {
      let passwd = this.passwd;
      passwd.p1 = new_passwd;
      this.handleChangeNewPasswd(passwd.p1, passwd.p2);
  };

  handleChangeNewPasswd2 = (event, new_passwd) => {
      let passwd = this.passwd;
      passwd.p2 = new_passwd;
      this.handleChangeNewPasswd(passwd.p1, passwd.p2);
  };

  getStepContent(stepIndex) {
    switch (stepIndex) {
        case 0:
            return (
                <div>
                  <p><b>Insert twice</b> your desired <b>new password</b>:</p>
                  <TextField
                      style={{marginTop: 0}}
                      floatingLabelText="Your new password"
                      type="password"
                      onChange={this.handleChangeNewPasswd1}
                      />
                  <br/>
                  <TextField
                      style={{marginTop: 0}}
                      floatingLabelText="Your new password again..."
                      type="password"
                      onChange={this.handleChangeNewPasswd2}
                      errorText={this.state.new_passwd_error_text}
                      />

                  <p><br/>Your new password must accomplish:</p>
                  <ul style={styles.withoutBullet}>
                      <li>{this.state.validSize} Larger than <strong>{PASSWD_MIN-1} chars</strong> <i>[{PASSWD_MIN + " <= len(password) <= " + PASSWD_MAX}]</i></li>
                      <li>{this.state.validPasswdCombi} Assert at least one of the following:</li>
                      <ul style={styles.withoutBullet}>
                          <li>{this.state.validUpper} Include an <strong>UPPER</strong> case character <i>[A-Z]</i></li>
                          <li>{this.state.validNumber} Include a <strong>n1mb3r</strong> <i>[0-9]</i></li>
                          <li>{this.state.validSymbol} Include a <strong>symbol</strong> <i>{"[-!$%^&*()_+|~=`{}[]:\";'\<>?,.\/)]"}</i></li>
                      </ul>
                  </ul>
                </div>
            );

        case 1:
            return (
                <div>
                    <p>Great! Now <b>insert your password</b> in the following field:</p>
                    <p>Your current password is needed to ensure that you're authorized to change it.</p>
                    <TextField
                        style={{marginTop: 0}}
                        floatingLabelText="Your current password"
                        type="password"
                        />
                </div>
            );
        default:
            return 'Mmmm.... that\'s embracing...';
    }
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
            disabled={!readyToNext}
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
              <StepLabel>New password</StepLabel>
          </Step>
          <Step>
            <StepLabel>Current password</StepLabel>
          </Step>
        </Stepper>
          {this.renderContent()}
      </div>
    );
  }
}

PasswordStepper.propTypes = {
    open: React.PropTypes.bool,
};
