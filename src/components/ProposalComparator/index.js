import React, { Component } from 'react'

import { Proposal } from '../Proposal'
import { Historical } from '../Historical'

import Paper from 'material-ui/Paper';

const styles = {
    horizontal: {
        display: 'inline-block',
        maxWidth: 530,
        margin: 20,
        textAlign: 'center',
    }
};

export class ProposalComparator extends Component {

    constructor(props) {
        super(props);

        this.state = {
        };
    }

    render() {
        const {title, elementA, elementB, mode} = this.props;

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

        //Handle view mode
        const result = (mode == "vertical")?
            (
                <div>
                    {ElementA}
                    <hr/>
                    {ElementB}
                </div>
            )
            :
            (
                <div>
                    <Paper style={styles.horizontal}>
                        {ElementA}
                    </Paper>
                    <Paper style={styles.horizontal}>
                        {ElementB}
                    </Paper>
                </div>
            )
        ;


        return  (
            <div>
                {
                (title) &&
                    <h3>{title}</h3>
                }

                {result}
            </div>

        );
    }
}

ProposalComparator.propTypes = {
    elementA: React.PropTypes.object.isRequired,
    elementB: React.PropTypes.object.isRequired,
    title: React.PropTypes.string,
    mode: React.PropTypes.string,
};
