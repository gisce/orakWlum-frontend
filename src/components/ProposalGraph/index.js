import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import {AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';

//import { updatePaths, toggleName, removeNode, changeOffset } from '../../actions/proposalGraph';

import {adaptProposalData} from '../../utils/graph';

const styles = {
    dialog: {
        width: '80%',
        maxWidth: 'none',
    },
    graphContainer: {
        maxWidth: '500px',
        maxHeight: '200px',
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
        };
    }

    render() {
        const prediction = this.props.proposal.prediction;
        const stacked = (this.props.stacked)?"1":null;

        const height = (this.props.height)?this.props.height:500;
        const width = (this.props.width)?this.props.width:1024;

        const isLite = (this.props.isLite)?this.props.isLite:false;

        const data=adaptProposalData(prediction);

        const areas = prediction.map(function(day, i) {
            return <Area key={"area"+i} type='monotone' dataKey={day.day} stackId={stacked} stroke={colors[i]} fill={colors[i]} />
        });


        return (isLite)?
        (
            <div >
                <ResponsiveContainer height={height} >
                    <AreaChart  data={data}
                        margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                        <XAxis dataKey="name"/>
                        <YAxis/>
                        <CartesianGrid strokeDasharray="3 3"/>
                        {areas}
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        )
        :
        (
            <div >
                <ResponsiveContainer height={height} >
                	<AreaChart  data={data}
                        margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                        <XAxis dataKey="name"/>
                        <YAxis/>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <Tooltip/>
                        {areas}
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        );
    }
}

ProposalGraph.propTypes = {
    proposal: React.PropTypes.object,
    stacked: React.PropTypes.bool,
    isLite: React.PropTypes.bool,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
};
