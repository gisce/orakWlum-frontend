import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {GridList, GridTile} from 'material-ui/GridList';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';

import * as actionCreators from '../../actions/proposals';


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
};

function mapStateToProps(state) {
    return {
        token: state.auth.token,
        userName: state.auth.userName,
        isAuthenticated: state.auth.isAuthenticated,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export class ProposalsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            proposals: props.proposals,
            title: props.title,
            path: props.path + "/",
        };

    }

    dispatchNewRoute(route) {
        browserHistory.push(route);
    }

    render() {
        const data_received = this.state.proposals;
        const ProposalsList = () => (

          <div style={styles.root}>
            <GridList
              cols={2}
              cellHeight={200}
              padding={1}
              style={styles.gridList}
            >
            <Subheader>{this.state.title}</Subheader>
              {data_received.map((tile, index) => (
                //<a href={this.state.path + index}>
                    <GridTile
                      key={tile.name}
                      title={"#" + (index+1) + " " + tile.name}
                      subtitle={<span>{new Date(tile.creationDate).toLocaleString()}</span>}
                      actionIcon={<IconButton><StarBorder color="white" /></IconButton>}
                      actionPosition="right"
                      titlePosition="top"
                      titleBackground="linear-gradient(to bottom, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"
                      cols={index < 4 ? 2 : 1}
                      rows={index < 4 ? 2 : 1}
                      onClick={() => this.dispatchNewRoute(this.state.path + (index +1))}
                      style={styles.gridTile}
                    >
                    <img src={tile.image} />

                    </GridTile>
                //</a>
              ))}
            </GridList>
          </div>
        );

        return (
            <div>
                <ProposalsList />
            </div>

        );
    }
}

ProposalsList.propTypes = {
    logoutAndRedirect: React.PropTypes.func,
    isAuthenticated: React.PropTypes.bool,
};
