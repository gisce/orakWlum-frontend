import Avatar  from 'material-ui/Avatar'
import Chip  from 'material-ui/Chip'
import { orange300, orange900, green300, green900, red300, red900, blue300, blue900 } from 'material-ui/styles/colors'
import React, { Component } from 'react'
import { browserHistory } from 'react-router'

//Default detele method
function handleRequestDelete() {
    console.log('Drop TAG.');

}

//Default touch method
function handleTouchTap() {
    console.log('Filtering by this TAG.');
}

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

export class Tag extends Component {
    render() {
        const tag = this.props.tag;

        if (tag != undefined) {

            const is_lite = (this.props.lite!=null)?this.props.lite:false;
            const is_readOnly = (this.props.readOnly)?(this.props.readOnly):false;
            const is_doubleClick = (this.props.onDoubleClick)?(this.props.onDoubleClick):false;

            const is_deletable = (this.props.handleRequestDelete)?(this.props.handleRequestDelete):handleRequestDelete;

            const is_selected = (this.props.selected)?(this.props.selected):false;

            const color = (tag.color)? tag.color : (is_selected)?"accepted":"base";
            const full = (tag.full)? tag.full : tag;
            const lite = (tag.lite)? tag.lite : "";

            let delete_method = is_deletable;
            let click_method = handleTouchTap;

            if (is_readOnly) {
                delete_method = null;
                click_method = null;
            }

            if (is_doubleClick) {
                click_method = is_doubleClick;
            }

            const Tag = (is_lite)?
                () => (
                  <div>
                      <Avatar style={styles.chip} size={32} color={colors[color].soft} backgroundColor={colors[color].hard}>
                        {lite}
                      </Avatar>
                  </div>
                )
                :
                () => (
                  <div>
                      <Chip
                          backgroundColor={colors[color].soft}
                          labelColor={colors[color].text}
                          onRequestDelete={delete_method}
                          onDoubleClick={click_method}
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
                <Tag />
            );
        }
        return null
    }
}

Tag.propTypes = {
};
