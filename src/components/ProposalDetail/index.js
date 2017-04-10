import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';


import CupsIcon from 'material-ui/svg-icons/communication/contacts';
import InvoicesIcon from 'material-ui/svg-icons/editor/format-list-numbered';

import {orange400} from 'material-ui/styles/colors';

import { Indicator } from '../Indicator';
import { ProposalTableMaterial } from '../ProposalTableMaterial';

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

        const total_cups = data.cups;
        const energy_total = data.energy_total;
        const total_invoices = data.invoices;
        const origins_data = data.origins;
        const tariffs_data = data.tariffs;

        //Prepare CUPS count
        const num_cups = (total_cups) &&
            (
                <Indicator
                    title="CUPS"
                    value={total_cups}
                    icon={<CupsIcon style={styles.icon}/>}
                />
            );


        //Prepare Invoices count
        const num_invoices =  (total_invoices) &&
            (
                <Indicator
                    title="Invoices"
                    value={total_invoices}
                    icon={<InvoicesIcon style={styles.icon}/>}
                    valueInfo="Amount of energy in kW"
                    subvalueInfo="Count of CUPS"
                />
            );


        //handle invoice types
        const invoice_types = (origins_data) &&
            Object.keys(origins_data).sort(
                function (a, b){
                    return origins_data[a].order - origins_data[b].order;
                }
            ).map(function(origin, i) {
                const entry = origins_data[origin];

                const component_name = origin;
                const component_value =  entry['energy'];
                const component_subvalue =  entry['count'];
                const original_position =  entry['order'];

                const color = colors[original_position];

                return (
                    <Indicator
                        key={"indicator_"+component_name}
                        title={component_name}
                        value={component_value + " kWh"}
                        subvalue={"#" + component_subvalue}
                        total={energy_total}
                        percentage={true}
                        small={true}
                    />
                )

            });




        //handle tariff tiles
        const tariffs = (tariffs_data) &&
            Object.keys(tariffs_data)
            /*.sort(
                function (a, b){
                    return tariffs_data[a].order - tariffs_data[b].order;
                }
                )
                */
            .sort() //sort by key ASC
            .map(function(tariff, i) {
                const entry = tariffs_data[tariff];

                const component_name = tariff;
                const component_value =  entry['energy'];
                const component_subvalue =  entry['count'];
                const original_position =  entry['order'];

                const color = colors[original_position];

                return (
                    <Indicator
                        key={"indicator_"+component_name}
                        title={ (component_name!="")?component_name:"Empty"}
                        value={component_value + " kWh"}
                        subvalue={"#" + component_subvalue}
                        total={energy_total}
                        percentage={true}
                        small={true}
                        color={color}
                    />
                )

            });


        //total tariffs count
        const total_tariffs_count = data.tariff_total_count;
        const total_tariffs_sum = data.measures_total;


        //Current aggregation average
        const avg_table = (avg_info) &&
            <ProposalTableMaterial
                stacked={true}
                data={avg_info.average}
                components={avg_info.components}
                height={500}
                totals={false}
                unit={"kWh"}
            />

        return (
            open &&
                <div style={styles.center}>
                    {num_cups}

                    {num_invoices}
                    <br/>
                    <br/>

                    <div>
                        <h2>ORIGINS</h2>
                        {invoice_types}
                    </div>
                    <br/>

                    <div>
                        <h2>TARIFFS</h2>
                        {tariffs}
                    </div>

                    <br/>
                    <br/>

                    <div>
                        <h2>AVERAGE</h2>
                        {avg_table}
                    </div>

                </div>
        );
    }
}

ProposalDetail.propTypes = {
    data: React.PropTypes.object.isRequired,
    open: React.PropTypes.bool,
    colors: React.PropTypes.object,
    avg_info: React.PropTypes.object,
};
