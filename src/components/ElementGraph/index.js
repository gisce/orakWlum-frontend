import React, { Component } from 'react';
import PropTypes from 'prop-types';
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

export class CustomTooltip extends Component {
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

              let {name} = component;
              let componentStyle = {
                backgroundColor: component.color,
                color: "white",
                padding: 5,
                borderRadius: 5,
                paddingLeft: 7,
                paddingRight: 7,
                textAlign: "left",
                fontSize: 12,
              };

              if (component.name == "total") {
                  componentStyle.backgroundColor = "white",
                  componentStyle.color = "black";
                  name = component.name.toUpperCase();
              }

              return <p key={"tooltip" + i} style={componentStyle}><strong>{name}</strong>: {component.value} {component.unit}</p>
            })
          }
        </div>
      );
    }

    return null;
  }
};

CustomTooltip.propTypes = {
  type: PropTypes.string,
  payload: PropTypes.array,
  label: PropTypes.any,
};


export class ElementGraph extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    // toDo review why the hour 0 stills appears

    render() {
        const data = this.props.data;
        const components = this.props.components;

        const howManyComponents = Object.keys(components).length;

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

            const unit = (typeof this.props.unit != 'undefined')?this.props.unit:"kWh";

            if (isAreaChart) {
              const areas = Object.keys(components).sort().map(function(component, i) {
                  return
                        <Area
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
              const bars = Object.keys(components)
              .sort() //sort by key ASC
              .map(function(component, i) {
                  return  (
                        <Bar
                            unit={unit}
                            isAnimationActive={isAnimated}
                            key={"area"+i}
                            type='monotone'
                            dataKey={component}
                            stackId={stacked}
                            stroke={colors[i]}
                            fill={colors[i]}
                          />
                  )
              });

              const line = <Line type='monotone' dataKey='total' stroke='#000000' unit={unit} />;

              //avoid showing legend if there are too many elements to show
              const legend = (howManyComponents < 55) ?
                <Legend width={100} layout="horizontal" align="center" wrapperStyle={styles.legend}/>
                :
                null;

              const xaxis = <XAxis dataKey="name" label={"Hour"}/>;
              const xaxisLite = <XAxis dataKey="name"/>;

              const yaxis = <YAxis label={unit}/>;
              const yaxisLite = <YAxis/>;

              const grid = <CartesianGrid strokeDasharray="3 3"/>;

              const tooltip = <Tooltip content={<CustomTooltip/>}/>;

              return (isLite)?
              (
                  <div >
                      <ResponsiveContainer height={height} >
                        <BarChart data={data}
                          margin={{top: 20, right: 20, left: 0, bottom: 0}}
                        >
                            {xaxisLite}
                            {yaxisLite}
                            {grid}
                            {bars}
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
                            margin={{top: 20, right: 50, left: 0, bottom: 0}}
                        >
                            {xaxis}
                            {yaxis}
                            {grid}
                            {bars}
                            {line}
                            {legend}
                            {tooltip}
                          </ComposedChart>
                      </ResponsiveContainer>
                  </div>
              );
            }
        }

        return null;
    }
}

ElementGraph.propTypes = {
    data: PropTypes.array,
    components: PropTypes.object,
    stacked: PropTypes.bool,
    isLite: PropTypes.bool,
    areaChart: PropTypes.bool,
    animated: PropTypes.bool,
    width: PropTypes.number,
    height: PropTypes.number,
    unit: PropTypes.string,
};
