import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {GridList, GridTile} from 'material-ui/GridList';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';

import * as actionCreators from '../../actions/proposals';
import { ProposalTag } from '../ProposalTag';
import { ProposalGraph } from '../ProposalGraph';

import {adaptProposalData} from '../../utils/graph';

import { dispatchNewRoute} from '../../utils/http_functions';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: 1024,
    overflowY: 'none',
  },
  gridTile: {
    cursor: 'pointer',
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  aggregations: {
      display: 'flex',
  },
};

function mapStateToProps(state) {
    return {
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export class ProposalList extends Component {
    constructor(props) {
        super(props);

        const defaultAggregation = "001";

        this.state = {
            open: false,
            title: props.title,
            path: props.path + "/",
            aggregationSelected: props.aggregations[defaultAggregation].id,
        };

        props.aggregations[defaultAggregation].selected = true;
    }

    changeProposalAggregation = (event, agg) => {
        //initialize selection of all elements
        const aggregations = this.props.aggregations;
        Object.keys(aggregations).map( function(agg, i) {
            aggregations[agg].selected = false;
        });

        //select current
        aggregations[agg].selected=true;

        //save it to change the graph
        this.setState({
            aggregationSelected: agg,
        });
    };

    render() {
        const data_received = this.props.proposals;

        const width=1024;
        const height=300;

        const howManyBig=1;
        const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

        // The Proposal Aggregations List
        const withPicture=true;
        const offset = 0;
        const size = 12;
        const aggregationsStyle = (withPicture)?styles.aggregations:styles.aggregationsRight;

        const changeProposalAggregation=this.changeProposalAggregation;
        const aggregations = this.props.aggregations;
        const aggregationSelected = this.state.aggregationSelected;

        const proposalAggregations = (
            aggregations &&
                <div
                    id="aggregationsList"
                    className={"col-md-offset-"+ (offset) + " col-md-" + size + " col-lg-offset-"+ (offset) + " col-lg-" + size}
                    style={aggregationsStyle}>
                {
                    Object.keys(aggregations).map( function(agg, i) {
                        return (
                            <div key={"aggregationDivTag_"+i} onClick={(e) => changeProposalAggregation(e, agg)}>
                                 <ProposalTag
                                     key={"aggregationTag_"+i}
                                     tag={aggregations[agg].lite}
                                     selected={aggregations[agg].selected}
                                     readOnly/>
                             </div>
                         );
                    })
                }
                </div>

        )

        // Last Proposals (the first bug, the other ones 2 per row)
        const lastProposals =data_received.map((tile, index) => {
            if (tile.prediction && Object.keys(tile.prediction).length >0 ) {
                const predictionAdapted=adaptProposalData(tile.prediction);
                const current = predictionAdapted[aggregationSelected];
                const data = current.result;
                const components = current.components;

                return (
                    <GridTile
                        key={tile.id}
                        title={"#" + (index+1) + " " + tile.name}
                        subtitle={<span>{days[new Date(tile.days_range[0]).getDay()]} {new Date(tile.days_range[0]).toLocaleDateString()}</span>}
                        actionIcon={<div style={styles.wrapper}><ProposalTag tag={tile.status} lite={true} /></div>}
                        actionPosition="right"
                        titlePosition="top"
                        titleBackground="linear-gradient(to bottom, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"
                        cols={index < howManyBig ? 2 : 1}
                        rows={index < howManyBig ? 2 : 1}
                        onClick={() => dispatchNewRoute(this.state.path + (tile.id))}
                        style={styles.gridTile}
                    >
                    <div><br/><br/><br/><br/></div>
                    <ProposalGraph
                          stacked={true}
                          data={data}
                          components={components}
                          width={ index < howManyBig ? width : width/2}
                          height={ index < howManyBig ? height : height/2.3}
                          isLite
                    />

                    </GridTile>
                );
            }
            else {
                return (
                    <GridTile
                        key={tile.id}
                        title={"#" + (index+1) + " " + tile.name}
                        subtitle={<span>{days[new Date(tile.days_range[0]).getDay()]} {new Date(tile.days_range[0]).toLocaleDateString()}</span>}
                        actionIcon={<div style={styles.wrapper}><ProposalTag tag={tile.status} lite={true} /></div>}
                        actionPosition="right"
                        titlePosition="top"
                        titleBackground="linear-gradient(to bottom, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"
                        cols={index < howManyBig ? 2 : 1}
                        rows={index < howManyBig ? 2 : 1}
                        onClick={() => dispatchNewRoute(this.state.path + (tile.id))}
                        style={styles.gridTile}
                    >
                    <div><br/><br/><br/><br/>
                        <p>Prediction not ready</p>
                    </div>
                    </GridTile>
                );

            }

        });

        const ProposalList = () => (
          <div style={styles.root}>
            <GridList
              cols={2}
              cellHeight={200}
              padding={1}
              style={styles.gridList}
            >
            <Subheader>{this.state.title}</Subheader>
              {lastProposals}
            </GridList>
          </div>
        );

        return (
            <div>
                <div className="row">{proposalAggregations}</div>
                <div className="row"><ProposalList /></div>
            </div>
        );
    }
}

ProposalList.propTypes = {
};
