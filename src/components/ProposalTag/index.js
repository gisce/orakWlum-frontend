import Avatar  from 'material-ui/Avatar'
import Chip  from 'material-ui/Chip'
import { orange300, orange900, green300, green900, red300, red900, blue300, blue900 } from 'material-ui/styles/colors'
import React, { Component } from 'react'
import { browserHistory } from 'react-router'

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
    base: {
        hard: blue900,
        soft: blue300,
        text: 'white',
    },
};

export class ProposalTag extends Component {
    dispatchNewRoute(route) {
        browserHistory.push(route);
    }

    render() {
        const tag = this.props.tag;
        const is_lite = (this.props.lite!=null)?this.props.lite:false;
        const is_readOnly = (this.props.readOnly)?(this.props.readOnly):false;

        const color = (tag.color)? tag.color : "base";
        const full = (tag.full)? tag.full : tag;
        const lite = (tag.lite)? tag.lite : "";

        let delete_method = handleRequestDelete;
        let click_method = handleTouchTap;

        if (is_readOnly) {
            delete_method = false;
            click_method = false;
        }

        const ProposalTag = (is_lite)?
            () => (
              <div style={styles.wrapper}>
                  <Avatar style={styles.chip} size={32} color={colors[color].soft} backgroundColor={colors[color].hard}>
                    {lite}
                  </Avatar>
              </div>
            )
            :
            () => (
              <div style={styles.wrapper}>
                  <Chip
                      backgroundColor={colors[color].soft}
                      labelColor={colors[color].text}
                      onRequestDelete={delete_method}
                      onTouchTap={click_method}
                      style={styles.chip}
                  >
                {
                    (lite != "") ?
                  <Avatar size={32} color={colors[color].soft} backgroundColor={colors[color].hard}>
                    {lite}
                  </Avatar>
                  :
                  <div></div>
                }

                {full}

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
