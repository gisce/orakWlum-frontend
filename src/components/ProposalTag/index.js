import React, { Component } from 'react';
import { browserHistory } from 'react-router';


import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import {orange300, orange900, green300, green900, red300, red900} from 'material-ui/styles/colors';


function handleRequestDelete() {
    alert('Treure TAG.');
}

function handleTouchTap() {
    alert('Filtrar per aquest TAG.');
}

const styles = {
    chip: {
      margin: 4,
    },
    wrapper: {
      display: 'flex',
      flexWrap: 'wrap',
    },
};

const colors = {
    pending: {
        hard: orange900,
        soft: orange300,
        text: 'white',
    },
    accepted: {
        hard: green900,
        soft: green300,
        text: 'white',
    },
    denied: {
        hard: red900,
        soft: red300,
        text: 'white',
    },
}

export class ProposalTag extends Component {
    dispatchNewRoute(route) {
        browserHistory.push(route);
    }

    render() {
        const tag = this.props.tag;
        const lite = (this.props.lite!=null)?this.props.lite:false;


        const ProposalTag = (lite)?
            () => (

              <div style={styles.wrapper}>
                  <Avatar style={styles.chip} size={32} color={colors[tag.color].soft} backgroundColor={colors[tag.color].hard}>
                    {tag.lite}
                  </Avatar>
              </div>
            )
            :
            () => (

              <div style={styles.wrapper}>
                  <Chip
                      backgroundColor={colors[tag.color].soft}
                      labelColor={colors[tag.color].text}
                      onRequestDelete={handleRequestDelete}
                      onTouchTap={handleTouchTap}
                      style={styles.chip}
                  >
                  <Avatar size={32} color={colors[tag.color].soft} backgroundColor={colors[tag.color].hard}>
                    {tag.lite}
                  </Avatar>

                {tag.full}

                  </Chip>
              </div>
          );


        return (
            <ProposalTag />
        );
    }
}

ProposalTag.propTypes = {
    logoutAndRedirect: React.PropTypes.func,
    isAuthenticated: React.PropTypes.bool,
};
