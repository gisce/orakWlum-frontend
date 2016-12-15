import React, { Component } from 'react'
import { browserHistory } from 'react-router'

import IconButton from 'material-ui/IconButton';
import ActionHome from 'material-ui/svg-icons/action/home';


//Default click method
function handleClick() {
    console.log('Refresh!');
}

const styles = {
  smallIcon: {
    width: 36,
    height: 36,
  },
  mediumIcon: {
    width: 48,
    height: 48,
  },
  largeIcon: {
    width: 60,
    height: 60,
  },
  small: {
    width: 72,
    height: 72,
    padding: 16,
  },
  medium: {
    width: 96,
    height: 96,
    padding: 24,
  },
  large: {
    width: 120,
    height: 120,
    padding: 30,
  },
};

export class RefreshButton extends Component {
    render() {

        const click_action = (this.props.onClick)?(this.props.onClick):this.handleClick;

        if (click_action) {
            click_method = click_action;
        }

        const Refresh =
            () => (
              <div>
                  <IconButton
                      iconStyle={styles.smallIcon}
                      style={styles.small}
                  >
                    <ActionHome />
                  </IconButton>
              </div>
            )
          );

        return (
            <Refresh />
        );
    }
}

RefreshButton.propTypes = {
};
