import React, { Component } from 'react'

import { Proposal } from '../Proposal'
import { Historical } from '../Historical'

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

const styles = {
    container: {
        textAlign: 'center',
    },
    horizontal: {
        display: 'inline-block',
        maxWidth: '46%',
        margin: '1em',
        textAlign: 'center',
    },
    change_mode_button: {
        marginBottom: 22
    },
};

export class ProposalComparator extends Component {

    constructor(props) {
        super(props);

        this.modes = ["horizontal", "unique"];
        this.mode_selected = (props.mode)?
            this.modes.indexOf(props.mode)
        :
            0
        ;

        this.state = {
            mode: this.modes[this.mode_selected],
        }

        this.toggleMode = this.toggleMode.bind(this);
    }


    toggleMode(){
        this.mode_selected = (this.mode_selected + 1) % this.modes.length;

        this.setState({
            mode: this.modes[this.mode_selected],
        });
    }



    render() {
        const {title, elementA, elementB, comparison} = this.props;

        const {mode} = this.state;

        const ElementA = (elementA.element.historical)?
            (
                <Historical
                    proposal={elementA.element}
                    aggregations={elementA.aggregations}
                    comparation={true}
                />
            )
            :
            (
                <Proposal
                    proposal={elementA.element}
                    aggregations={elementA.aggregations}
                    comparation={true}
                />
            )
        ;

        const ElementB = (elementB.element.historical)?
        (
            <Historical
                proposal={elementB.element}
                aggregations={elementB.aggregations}
                comparation={true}
            />
        )
        :
        (
            <Proposal
                proposal={elementB.element}
                aggregations={elementB.aggregations}
                comparation={true}
            />
        )
        ;

        const Comparison = (comparison.element.historical)?
        (
            <Historical
                proposal={comparison.element}
                aggregations={comparison.aggregations}
                comparation={false}
            />
        )
        :
        (
            <Proposal
                proposal={comparison.element}
                aggregations={comparison.aggregations}
                comparation={false}
            />
        )
        ;


        const change_mode_button  = (
            <RaisedButton
              label="Change view"
              onTouchTap={this.toggleMode}
              style={styles.change_mode_button}
            />
        );

        //Handle view mode
        const result = (mode == "horizontal")?
            (
                <div style={styles.container}>
                    <Paper style={styles.horizontal}>
                        {ElementA}
                    </Paper>
                    <Paper style={styles.horizontal}>
                        {ElementB}
                    </Paper>
                </div>
            )
            :
            (mode == "unique")?
                (
                    <div>
                        {Comparison}
                    </div>
                )
                :
                (
                    <div>
                        {ElementA}
                        <hr/>
                        {ElementB}
                    </div>
                )

        ;


        return  (
            <div>
                {
                (title) &&
                    <h3>{title}</h3>
                }

                {change_mode_button}
                {result}
            </div>

        );
    }
}

ProposalComparator.propTypes = {
    elementA: React.PropTypes.object.isRequired,
    elementB: React.PropTypes.object.isRequired,
    comparison: React.PropTypes.object.isRequired,
    title: React.PropTypes.string,
    mode: React.PropTypes.string.isRequired,
};
