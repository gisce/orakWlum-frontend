import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {GridList, GridTile} from 'material-ui/GridList';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';

import * as actionCreators from '../../actions/proposals';
import { ProposalTag } from '../ProposalTag';
import { ProposalGraphOld } from '../ProposalGraphOld';

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
        this.state = {
            open: false,
            proposals: props.proposals,
            title: props.title,
            path: props.path + "/",
        };
    }

    render() {
        const data_received = this.state.proposals;

        const width=1024;
        const height=300;

        const howManyBig=1;

        const ProposalList = () => (

          <div style={styles.root}>
            <GridList
              cols={2}
              cellHeight={200}
              padding={1}
              style={styles.gridList}
            >
            <Subheader>{this.state.title}</Subheader>
              {data_received.map((tile, index) => (
                    <GridTile
                      key={tile.id}
                      title={"#" + (index+1) + " " + tile.name}
                      subtitle={<span>{new Date(tile.creation_date).toLocaleString()}</span>}
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
                    <ProposalGraphOld
                        stacked={true}
                        proposal={tile}
                        width={ index < howManyBig ? width : width/2}
                        height={ index < howManyBig ? height : height/2.3}
                        isLite
                    />

                    </GridTile>
              ))}
            </GridList>
          </div>
        );

        return (
            <div>
                <ProposalList />
            </div>
        );
    }
}

ProposalList.propTypes = {
};
