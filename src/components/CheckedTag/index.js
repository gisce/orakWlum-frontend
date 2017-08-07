import Avatar  from 'material-ui/Avatar'
import Chip  from 'material-ui/Chip'
import { orange300, orange900, green300, green900, red300, red900, blue300, blue900 } from 'material-ui/styles/colors'
import React, { Component } from 'react'
import { browserHistory } from 'react-router'

const styles = {
    chip: {
      margin: 4,
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

export class CheckedTag extends Component {
    render() {
        const color = "accepted";

        return (
            <div>
                <Avatar style={styles.chip} size={32} color={colors[color].soft} backgroundColor={colors[color].hard}>
                  ✓
                </Avatar>
            </div>
        );
    }
}

CheckedTag.propTypes = {
};
