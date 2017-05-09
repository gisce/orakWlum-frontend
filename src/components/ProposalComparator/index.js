import React, { Component } from 'react'

import { SettingsSources } from '../Proposal'

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

            </div>

        );
    }
}

ProposalComparator.propTypes = {
    elementA: React.PropTypes.object.isRequired,
    elementB: React.PropTypes.object.isRequired,
    title: React.PropTypes.string,
};
