import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';


import CupsIcon from 'material-ui/svg-icons/communication/contacts';
import InvoicesIcon from 'material-ui/svg-icons/editor/format-list-numbered';

import {orange400} from 'material-ui/styles/colors';

import { Indicator } from '../Indicator';
import { ProposalTableMaterial } from '../ProposalTableMaterial';
import {adaptProposalData} from '../../utils/graph';

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
        const avg_info = this.props.avg_info;

        //open it by default
        const open = (this.props.open)?this.props.open:true;

        //handle invoice types
        const invoice_types = (data.invoice_types) &&
            Object.keys(data.invoice_types).map(function(component, i) {

                const component_name = component
                const component_value =  data.invoice_types[component];


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


        //handle tariff count
        let cups_per_tariff = {};
        const tariff_count = (data.tariff_count) &&

            Object.keys(data.tariff_count).map(function(i) {
                const entry = data.tariff_count[i];

                const component_name = entry['name'];
                const component_value =  entry['count'];
                const original_position =  entry['position'];

                const color = colors[original_position];

                cups_per_tariff[component_name] = component_value;

                return (
                    <Indicator
                        key={"indicator_"+component_name}
                        title={ (component_name!="")?component_name:"Empty"}
                        value={component_value}
                        total={data.tariff_total}
                        percentage={true}
                        small={true}
                        color={color}
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


        // Calc the AVG per tariff (tariff / num_cups)
        for (var hora=0; hora<avg_info.data.length; hora++){
            let una_hora = avg_info.data[hora];
            
            Object.keys(una_hora).map(function(agg) {
                const num_cups = cups_per_tariff[agg];

                if (agg != "total" && agg != "name")
                    una_hora[agg] = (una_hora[agg] / num_cups).toFixed(4).toString().replace(".", ",");
            });
        }


        const avg_tariff_table = (data.tariff_count) &&
            <ProposalTableMaterial stacked={true} data={avg_info.data} components={avg_info.components} height={500} />



        return (
            open &&
                <div style={styles.center}>
                    {num_cups}

                    {num_invoices}

                    {invoice_types}
                    <br/>
                        <br/>

                    <div>
                        <h3>TARIFF COUNT</h3>
                        {tariff_count}
                    </div>

                    <div>
                        <h3>TARIFF AVG</h3>
                        {avg_tariff_table}
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
