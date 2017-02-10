import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { Indicator } from '../Indicator';

//import { updatePaths, toggleName, removeNode, changeOffset } from '../../actions/proposalGraph';

import {colors} from '../../constants';

const styles = {
};


export class ProposalDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const data = this.props.data;

        //open it by default
        const open = (this.props.open)?this.props.open:true;

        //handle invoice types
        const invoice_types = (data.invoice_types) &&
            Object.keys(data.invoice_types).map(function(component, i) {
                const component_name = data.invoice_types[component].name;
                const component_value =  data.invoice_types[component].value;

                return (
                    <Indicator
                        title={component_name}
                        value={component_value}
                    />
                )
            });

        //Prepare CUPS count
        const num_cups = (data.cups_total) &&
            (
                <Indicator
                    title="CUPS"
                    value={data.cups_total}
                />
            );

        //Prepare Invoices count
        const num_invoices =  (data.invoice_total) &&
            (
                <Indicator
                    title="Invoices"
                    value={data.invoice_total}
                />
            );

        return (
            open &&
                <div >
                    {num_cups}

                    {num_invoices}

                    {invoice_types}
                </div>
        );
    }
}

ProposalDetail.propTypes = {
    data: React.PropTypes.object.isRequired,
    open: React.PropTypes.bool,
    colors: React.PropTypes.object,
};
