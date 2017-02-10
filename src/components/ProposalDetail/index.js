import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';


import CupsIcon from 'material-ui/svg-icons/communication/contacts';
import InvoicesIcon from 'material-ui/svg-icons/editor/format-list-numbered';

import {orange400} from 'material-ui/styles/colors';

import { Indicator } from '../Indicator';

//import { updatePaths, toggleName, removeNode, changeOffset } from '../../actions/proposalGraph';

import {colors} from '../../constants';

const styles = {
    center: {
        textAlign: 'center',
    },
    icon: {
        color: orange400,
        width: 50,
        height: 50,
        fontSize: 20,
    },
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
                        key={"indicator_"+component_name}
                        title={component_name}
                        value={component_value}
                        total={data.invoice_total}
                        percentage={true}
                    />
                )
        });


        //handle tariff average
        const tariff_average = (data.tariff_average) &&
            Object.keys(data.tariff_average).map(function(component, i) {
                console.log(data.tariff_average[component]);
                const component_name = data.tariff_average[component].name;
                const component_value =  data.tariff_average[component].value;

                return (
                    <Indicator
                        key={"indicator_"+component_name}
                        title={component_name}
                        value={component_value}
                        total={data.tariff_total}
                        percentage={true}
                        small={true}
                    />
                )
            });


        //Prepare CUPS count
        const num_cups = (data.cups_total) &&
            (
                <Indicator
                    title="CUPS"
                    value={data.cups_total}
                    icon={<CupsIcon style={styles.icon}/>}
                />
            );

        //Prepare Invoices count
        const num_invoices =  (data.invoice_total) &&
            (
                <Indicator
                    title="Invoices"
                    value={data.invoice_total}
                    icon={<InvoicesIcon style={styles.icon}/>}
                />
            );

        return (
            open &&
                <div style={styles.center}>
                    {num_cups}

                    {num_invoices}

                    {invoice_types}

                    <div>
                        <h3>TARIFF AVERAGES</h3>
                        {tariff_average}
                    </div>

                </div>
        );
    }
}

ProposalDetail.propTypes = {
    data: React.PropTypes.object.isRequired,
    open: React.PropTypes.bool,
    colors: React.PropTypes.object,
};
