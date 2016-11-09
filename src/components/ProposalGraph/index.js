import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import {AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';

import { updatePaths, toggleName, removeNode, changeOffset } from '../../actions/ProposalGraph';

import {adaptProposalData} from '../../utils/graph';

const styles = {
    dialog: {
      width: '80%',
      maxWidth: 'none',
    }
};

const colors = [
    '#db4939',
    '#f29913',
    '#3c8cba',
    '#00a658'
]

export class ProposalGraph extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: props.open,
        };
    }

    render() {
        const prediction = this.props.proposal.prediction;
        const data=adaptProposalData(prediction);

        const areas = prediction.map(function(day, i) {
            return <Area key={"area"+i} type='monotone' dataKey={day.day} stackId="1" stroke={colors[i]} fill={colors[i]} />
        });

        return (
        	<AreaChart width={1024} height={600} data={data}
                margin={{top: 10, right: 30, left: 0, bottom: 0}}>
            <XAxis dataKey="name"/>
            <YAxis/>
            <CartesianGrid strokeDasharray="3 3"/>
            <Tooltip/>
            {areas}
          </AreaChart>
        );
    }
}

ProposalGraph.propTypes = {
    proposal: React.PropTypes.list,
};
