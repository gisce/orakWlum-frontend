import React, { Component } from 'react'

import { Proposal } from '../Proposal'
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

        const {title, elementA, elementB} = this.props;

        const ProposalA = (
            <Proposal
                proposal={elementA.element}
                aggregations={elementA.aggregations}
            />
        );

        const ProposalB = (
            <Proposal
                proposal={elementB.element}
                aggregations={elementB.aggregations}
            />
        );

        //Handle view mode

        const mode = "horizontal";
        const result = (mode == "vertical")?
            (
                <div>
                    {ProposalA}
                    <hr/>
                    {ProposalB}
                </div>
            )
            :
            (
                <div>
                    <Paper style={styles.horizontal}>
                        {ProposalA}
                    </Paper>
                    <Paper style={styles.horizontal}>
                        {ProposalB}
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
};
