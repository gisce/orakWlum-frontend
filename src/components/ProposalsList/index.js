import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AppBar from 'material-ui/AppBar';
import LeftNav from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';


import {GridList, GridTile} from 'material-ui/GridList';

import * as actionCreators from '../../actions/auth';


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
        };

    }

    dispatchNewRoute(route) {
        browserHistory.push(route);
        this.setState({
            open: false,
        });

    }


    handleClickOutside() {
        this.setState({
            open: false,
        });
    }


    logout(e) {
        e.preventDefault();
        this.props.logoutAndRedirect();
        this.setState({
            open: false,
        });
    }

    openNav() {
        this.setState({
            open: true,
        });
    }

    render() {

        const data_received = this.state.proposals

        const ProposalsList = () => (
          <div style={styles.root}>
            <GridList
              cols={2}
              cellHeight={200}
              padding={1}
              style={styles.gridList}
            >
              {data_received.map((tile, index) => (
                <GridTile
                  key={tile.name}
                  title={"#" + (index+1) + " " + tile.name + "  .........  " + new Date(tile.creationDate).toLocaleString()}
                  actionPosition="left"
                  titlePosition="top"
                  titleBackground="linear-gradient(to bottom, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"
                  cols={index < 4 ? 2 : 1}
                  rows={index < 4 ? 2 : 1}
                >
                <img src={tile.image} />

                </GridTile>
              ))}
            </GridList>
          </div>
        );

        return (
            <div>
                <h3>{this.state.title}</h3>
                <ProposalsList />
            </div>

        );
    }
}

ProposalsList.propTypes = {
    logoutAndRedirect: React.PropTypes.func,
    isAuthenticated: React.PropTypes.bool,
};
