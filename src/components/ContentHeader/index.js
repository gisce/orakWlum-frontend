import React, { Component } from 'react'
import PropTypes from 'prop-types';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Refresh from 'material-ui/svg-icons/navigation/refresh';

import { intlShape, injectIntl } from 'react-intl';

const styles = {
    buttonAdd: {
        marginRight: 20,
    },
    buttonPosition: {
        textAlign: 'right',
    }
};

class ContentHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { intl } = this.props;
        const title = this.props.title;
        const withAdd = (this.props.addButton)?this.props.addButton:false;
        const withRefresh = (this.props.refreshButton)?this.props.refreshButton:false;

        const withButton = withAdd || withRefresh;

        const addClickMethod = (this.props.addClickMethod)?this.props.addClickMethod:null;
        const refreshClickMethod = (this.props.refreshClickMethod)?this.props.refreshClickMethod:null;

        // The Refresh Button
        const refreshButton = (
            (withRefresh)?
                <FloatingActionButton style={styles.buttonAdd} title={intl.formatMessage({id: "CalendarView.refresh", defaultMessage: "Refresh"})} onClick={() => refreshClickMethod()}>
                      <Refresh />
                </FloatingActionButton>
            :
                null
        )

        // The Add Button
        const addButton = (
            (withAdd)?
                <FloatingActionButton style={styles.buttonAdd} title={intl.formatMessage({id: "CalendarView.addnewelement", defaultMessage: "Add a new element"})} onClick={() => addClickMethod()}>
                      <ContentAdd />
                </FloatingActionButton>
            :
                null
        );


        return (
            <div className='row'>
                <div className="col-md-6"><h1>{title}</h1></div>
                    { withButton &&
                        <div className="col-md-6" style={styles.buttonPosition}>
                                {refreshButton}
                                {addButton}
                        </div>
                    }
            </div>

        );
    }
}

ContentHeader.propTypes = {
    intl: intlShape.isRequired,
    title: PropTypes.string.isRequired,
    addButton: PropTypes.bool,
    refreshButton: PropTypes.bool,
    addClickMethod: PropTypes.func,
    refreshClickMethod: PropTypes.func,
};

export default injectIntl(ContentHeader);