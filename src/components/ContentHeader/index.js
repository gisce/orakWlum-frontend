import React, { Component } from 'react'

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

const styles = {
    buttonAdd: {
        marginRight: 20,
    },
    buttonPosition: {
        textAlign: 'right',
    }
};

export class ContentHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const title = this.props.title;
        const withButton = (this.props.addButton)?this.props.addButton:false;
        const onClickMethod = (this.props.buttonClickMethod)?this.props.buttonClickMethod:null;

        const addButton = (
            <FloatingActionButton style={styles.buttonAdd} onClick={() => onClickMethod()}>
                  <ContentAdd />
            </FloatingActionButton>
        )

        return (
            <div className='row'>
                <div className="col-md-6"><h1>{title}</h1></div>
                    { withButton &&
                        <div className="col-md-6" style={styles.buttonPosition}>{addButton}</div>
                    }
            </div>

        );
    }
}

ContentHeader.propTypes = {
    title: React.PropTypes.string.isRequired,
    addButton: React.PropTypes.bool,
    buttonClickMethod: React.PropTypes.func,
};
