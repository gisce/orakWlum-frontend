import React, { Component } from 'react'
import PropTypes from 'prop-types';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import Elementt from '../Element';

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

export class ElementComparator extends Component {

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

        const ElementA =
                <Elementt
                    proposal={elementA.element}
                    aggregations={elementA.aggregations}
                    comparation={true}
                />

        const ElementB =
            <Elementt
                proposal={elementB.element}
                aggregations={elementB.aggregations}
                comparation={true}
            />

        const Comparison =
            <Elementt
                proposal={comparison.element}
                aggregations={comparison.aggregations}
            />

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

ElementComparator.propTypes = {
    elementA: PropTypes.object.isRequired,
    elementB: PropTypes.object.isRequired,
    comparison: PropTypes.object.isRequired,
    title: PropTypes.string,
    mode: PropTypes.string.isRequired,
};
