import React, { Component } from 'react'

import { Proposal } from '../Proposal'

const styles = {
};

export class ProposalComparator extends Component {

    constructor(props) {
        super(props);

        this.state = {
        };
    }

    render() {
        const {title, elementA, elementB} = this.props;

        return  (
            <div>

                {
                (title) &&
                    <h3>{title}</h3>
                }

                <Proposal
                    proposal={elementA.element}
                    aggregations={elementA.aggregations}
                    />

            </div>

        );
    }
}

ProposalComparator.propTypes = {
    elementA: React.PropTypes.object.isRequired,
    elementB: React.PropTypes.object.isRequired,
    title: React.PropTypes.string,
};
