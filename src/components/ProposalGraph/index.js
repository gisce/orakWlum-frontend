import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { updatePaths, toggleName, removeNode, changeOffset } from '../../actions/ProposalGraph';
import { Table, TableRow, TableRowColumn, TableBody } from 'material-ui/table';
import { Card, CardHeader } from 'material-ui/Card';
import Slider from 'material-ui/Slider';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import { Chart } from '../Chart';
import { XAxis } from '../XAxis';
import { YAxis } from '../YAxis';
import { Path } from '../Path';

import { utcFormat } from 'd3-time-format';
const dateFormat = utcFormat('%-d/%-m/%Y');

import { format } from 'd3-format';
const numberFormat = format(',');
const percentFormat = format('.1p');

import { scaleOrdinal } from 'd3-scale';


function mapStateToProps(state) {
    return {
        token: state.auth.token,
        userName: state.auth.userName,
        userRoles: state.auth.userRoles,
        userGroups: state.auth.userGroups,
        userImage: state.auth.userImage,
        isAuthenticated: state.auth.isAuthenticated,
        path: state.routing.locationBeforeTransitions.pathname,
    };
}

@connect(mapStateToProps)
export class ProposalGraph extends Component {
    constructor(props) {
        super(props);
        console.log("arribo");

        let colors = scaleOrdinal()
          .domain(this.props.names.map(d => d.name))
          .range(['#9C6744', '#C9BEB9', '#CFA07E', '#C4BAA1', '#C2B6BF', '#8FB5AA', '#85889E', '#9C7989', '#91919C', '#99677B', '#918A59', '#6E676C', '#6E4752', '#6B4A2F', '#998476', '#8A968D', '#968D8A', '#968D96', '#CC855C', '#967860', '#929488', '#949278', '#A0A3BD', '#BD93A1', '#65666B', '#6B5745', '#6B6664', '#695C52', '#56695E', '#69545C', '#565A69', '#696043', '#63635C', '#636150', '#333131', '#332820', '#302D30', '#302D1F', '#2D302F', '#CFB6A3']);


        this.state = {duration: 1000, colorMap: colors, activeName: ''};
    }

    componentDidMount() {
        let { dispatch } = this.props;
        dispatch(updatePaths());
    }

    removeItem(key) {
        let {dispatch} = this.props;
        dispatch(removeNode(key));
    }

    setDuration(e, value) {
        this.setState({
          duration: Math.floor(value * 10000)
        });
    }

    setActiveName(name) {
        this.setState({
          activeName: name
        });
    }

    toggleName(index) {
        let { dispatch } = this.props;
        dispatch(toggleName(index));
    }


    render() {
        const open = this.state.open;

        const actions = [
          <FlatButton
            label="Done"
            primary={true}
            onTouchTap={this.handleClose}
          />,
        ];

        let {view, trbl, names, mounted, dispatch, offset, xScale, yScale} = this.props;

        let {duration, colorMap, activeName} = this.state;

        let pathNodes = Object.keys(mounted).map(key => {
          let node = mounted[key];
          return (
            <Path
              key={key} node={node} duration={duration}
              fill={key === activeName ? '#FF4C4C': colorMap(key)}
              xScale={xScale} yScale={yScale}
              removeNode={this.removeItem.bind(this)}
              makeActive={this.setActiveName.bind(this, key)}
            />
          );
        });

        let tableRows = names.map(item => {
          return (
            <TableRow
              key={item.name}
              selected={item.show === true}
              onMouseOver={this.setActiveName.bind(this, item.name)}
              style={{
                cursor: 'pointer',
                backgroundColor: item.name === activeName ? 'red': 'rgba(0,0,0,0)'
              }}
            >
              <TableRowColumn>{item.name}</TableRowColumn>
            </TableRow>
          );
        });

        let yAxis = null, xAxis = null;

        if (yScale.ticks && xScale.ticks) {
          xAxis = (
            <XAxis
              xScale={xScale}
              yScale={yScale}
              format={dateFormat}
              duration={duration}
            />
          );
          yAxis = (
            <YAxis
              xScale={xScale}
              yScale={yScale}
              format={offset === 'expand' ? percentFormat: numberFormat}
              duration={duration}
            />
          );
        }

        return (
          <Card>
            <CardHeader
              title='React Chart Transitions'
              subtitle='Enter, update and exit pattern using React 15.0, D3 4.0 and Redux'
              actAsExpander={false}
              showExpandableButton={false}
            />
            <div className='row' style={{marginLeft: 0, marginRight: 0}}>
              <div className='col-md-5 col-sm-5'>
                <div className='row'>
                  <div className='col-md-5 col-sm-5'style={{paddingLeft: 20}}>
                    <span>Chart Offset:</span>
                    <RadioButtonGroup
                      name='offsets'
                      valueSelected={offset}
                      onChange={(e, d) => dispatch(changeOffset(d))}
                    >
                      <RadioButton
                        value="stacked"
                        label="Stacked"
                      />
                      <RadioButton
                        value="stream"
                        label="Stream"
                      />
                      <RadioButton
                        value="expand"
                        label="Expand"
                      />
                    </RadioButtonGroup>
                  </div>
                  <div className='col-md-7 col-sm-7'>
                    <span>Transition Duration: {(duration / 1000).toFixed(1)}</span>
                    <Slider
                      style={{marginTop: 10, marginBottom: 10}}
                      defaultValue={0.1}
                      onChange={this.setDuration.bind(this)}
                    />
                  </div>
                </div>
              </div>
              <div className='col-md-7 col-sm-7'>
                <h4 style={{margin: 0}}>Random Counts of Fruits Over Time</h4>
                <p>This data is completely fictitious.  It's creating random series of data for 10 randomly chosen fruit names (150 points per series). It uses the same data generator used in Mike Bostock's <a href='https://bl.ocks.org/mbostock/4060954'>stream graph example</a>.  If you refresh the page you will get a new random dataset.</p>
              </div>
            </div>
            <div className='row' style={{marginTop: 10, marginBottom: 50}}>
              <div
                className='col-md-3 col-sm-3'
                onMouseLeave={this.setActiveName.bind(this, '')}
              >
                <Table
                  height={'500px'}
                  multiSelectable={true}
                  wrapperStyle={{width: '100%'}}
                  onCellClick={d => this.toggleName(d)}
                >
                  <TableBody
                    deselectOnClickaway={false}
                  >
                    {tableRows}
                  </TableBody>
                </Table>
              </div>
              <div
                className='col-md-9 col-sm-9'
                style={{padding: 0}}
                onMouseLeave={this.setActiveName.bind(this, '')}
              >
                <Chart view={view} trbl={trbl}>
                  {pathNodes}{xAxis}{yAxis}
                  <text
                    x={5} y={15}
                    fill='#fff'
                    style={{pointerEvents: 'none'}}
                  >{activeName}</text>
                </Chart>
              </div>
            </div>
          </Card>
        );

    }
}

ProposalGraph.propTypes = {
    open: React.PropTypes.bool,
};
