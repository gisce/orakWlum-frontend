import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import {ComposedChart, AreaChart, Area, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend} from 'recharts';



//import { updatePaths, toggleName, removeNode, changeOffset } from '../../actions/proposalGraph';

import {adaptProposalData} from '../../utils/graph';

import {colors} from '../../constants';

const styles = {
    dialog: {
        width: '80%',
        maxWidth: 'none',
    },
    graphContainer: {
        maxWidth: '500px',
        maxHeight: '200px',
    },
    tooltip: {
      backgroundColor: "white",
      border: "1px solid grey",
      paddingLeft: 15,
      paddingRight: 15,
    },
    legend: {
      width: "100%",
    },
};

const CustomTooltip  = React.createClass({
  propTypes: {
    type: PropTypes.string,
    payload: PropTypes.array,
    label: PropTypes.any,
  },

  render() {
    const { active } = this.props;

    if (active) {
      const { payload, label } = this.props;
      return (
        <div style={styles.tooltip} className="custom-tooltip">
          <h4 className="desc"><strong>Hour #{label}</strong></h4>
          {
            Object.keys(payload).map(function(comp, i) {
              const component = payload[i];
              const componentStyle = {
                backgroundColor: component.color,
                color: "white",
                padding: 5,
                borderRadius: 5,
                paddingLeft: 7,
                paddingRight: 7,
                textAlign: "left",
              };
              const name = (component.name == "total")?component.name.toUpperCase():component.name;
              return <p key={"tooltip" + i} style={componentStyle}>{name}: {component.value} {component.unit}</p>
            })
          }
        </div>
      );
    }

    return null;
  }
});

export class ProposalGraph extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    // toDo review why the hour 0 stills appears

    render() {
        const data = this.props.data;
        const components = this.props.components;

        const stacked = (this.props.stacked)?"1":null;

        const height = (this.props.height)?this.props.height:500;
        const width = (this.props.width)?this.props.width:1024;

        const isLite = (this.props.isLite)?this.props.isLite:false;
        const isAreaChart = (this.props.areaChart)?this.props.areaChart:false;

        const isAnimated = (this.props.animated)?this.props.animated:false;

        if (data && components) {
            /* Aggregations selector
            const areas = prediction.map(function(day, i) {
                return <Area key={"area"+i} type='monotone' dataKey={day.day} stackId={stacked} stroke={colors[i]} fill={colors[i]} />
            });
            //*/

            const unit = "kW";

            if (isAreaChart) {
              const areas = Object.keys(components).map(function(component, i) {
                  return <Area
                            unit={unit}
                            isAnimationActive={isAnimated}
                            key={"area"+i}
                            type='monotone'
                            dataKey={component}
                            stackId={stacked}
                            stroke={colors[i]}
                            fill={colors[i]}
                          />
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
                      	<AreaChart data={data}
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
            else {
              const bars = Object.keys(components).map(function(component, i) {
                  return <Bar
                            unit={unit}
                            isAnimationActive={isAnimated}
                            key={"area"+i}
                            type='monotone'
                            dataKey={component}
                            stackId={stacked}
                            stroke={colors[i]}
                            fill={colors[i]}
                          />
              });

              const line = <Line type='monotone' dataKey='total' stroke='#000000' unit={unit} label={{maringBottom: 10}}/>;
              const legend = <Legend width={100} layout="horizontal" align="center" wrapperStyle={styles.legend}/>;

              const xaxis = <XAxis dataKey="name"/>;
              const yaxis = <YAxis label={unit}/>;

              return (isLite)?
              (
                  <div >
                      <ResponsiveContainer height={height} >
                        <BarChart data={data}
                            margin={{top: 20, right: 30, left: 0, bottom: 0}}
                        >
                            {xaxis}
                            {yaxis}
                            <CartesianGrid strokeDasharray="3 3"/>
                            {bars}
                            {line}
                          </BarChart>
                      </ResponsiveContainer>
                  </div>
              )
              :
              (
                  <div >
                      <ResponsiveContainer height={height} >
                      	<ComposedChart
                            data={data}
                            margin={{top: 20, right: 30, left: 0, bottom: 0}}
                        >
                            {xaxis}
                            {yaxis}
                            <CartesianGrid strokeDasharray="3 3"/>
                            <Tooltip content={<CustomTooltip/>}/>
                            {bars}
                            {line}
                            {legend}
                          </ComposedChart>
                      </ResponsiveContainer>
                  </div>
              );
            }
        }

        return null;
    }
}

ProposalGraph.propTypes = {
    data: React.PropTypes.array,
    components: React.PropTypes.object,
    stacked: React.PropTypes.bool,
    isLite: React.PropTypes.bool,
    areaChart: React.PropTypes.bool,
    animated: React.PropTypes.bool,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
};
