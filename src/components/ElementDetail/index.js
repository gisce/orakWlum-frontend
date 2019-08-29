import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


import CupsIcon from 'material-ui/svg-icons/communication/contacts';
import InvoicesIcon from 'material-ui/svg-icons/editor/format-list-numbered';
import LossIcon from 'material-ui/svg-icons/av/shuffle';

import {orange400} from 'material-ui/styles/colors';

import { Indicator } from '../Indicator';
import { ElementTable } from '../ElementTable';

//import { updatePaths, toggleName, removeNode, changeOffset } from '../../actions/proposalGraph';

import {colors} from '../../constants';

import {FormattedHTMLMessage} from 'react-intl';

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


export class ElementDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const {withLosses, data, avg_info} = this.props;
        const digitsToRound = 2;

        //open it by default
        const open = (this.props.open)?this.props.open:true;

        const total_cups = data.cups;
        const loss_versions_list = data.loss_versions;
        const energy_total = data.energy_total;
        const energy_total_with_losses = data.energy_with_losses_total;
        const total_invoices = data.invoices;
        const origins_data = data.origins;
        const tariffs_data = data.tariffs;

        const expectedEnergy = (withLosses)? "energy_total" : "energy";
        const expectedTotal = (withLosses)? energy_total_with_losses : energy_total;

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
                    title={<FormattedHTMLMessage id="ProposalView.invoices" defaultMessage="Invoices"/>}
                    value={total_invoices}
                    icon={<InvoicesIcon style={styles.icon}/>}
                    valueInfo="Amount of energy in kW"
                    subvalueInfo="Count of CUPS"
                />
            );

          //Prepare Loss versions
          const loss_versions = (loss_versions_list) &&
              (
                  <Indicator
                      title={<FormattedHTMLMessage id="ProposalView.lossversion" defaultMessage="Loss Version"/>}
                      value={loss_versions_list}
                      icon={<LossIcon style={styles.icon}/>}
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
                const component_value =  Math.round(parseFloat(entry[expectedEnergy]));
                const component_subvalue =  entry['count'];
                const original_position =  entry['order'];

                const color = colors[original_position];

                return (
                    <Indicator
                        key={"indicator_"+component_name}
                        title={component_name}
                        value={component_value + " kWh"}
                        subvalue={"#" + component_subvalue}
                        total={expectedTotal}
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
                const component_value =  Math.round(parseFloat(entry[expectedEnergy]));

                const component_subvalue =  entry['count'];
                const original_position =  entry['order'];

                //const color = colors[original_position];  //use API order field
                const color = colors[i];

                return (
                    <Indicator
                        key={"indicator_"+component_name}
                        title={ (component_name!="")?component_name:"Empty"}
                        value={component_value + " kWh"}
                        subvalue={"#" + component_subvalue}
                        total={expectedTotal}
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
            <ElementTable
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

                    {loss_versions}
                    <br/>
                    <br/>

                    <div>
                        <h2>
                        <FormattedHTMLMessage id="ProposalView.origins" defaultMessage="ORIGINS"/>
                        </h2>
                        {invoice_types}
                    </div>
                    <br/>

                    <div>
                        <h2>
                        <FormattedHTMLMessage id="ProposalView.tariffs" defaultMessage="TARIFFS"/>
                        </h2>
                        {tariffs}
                    </div>

                    <br/>
                    <br/>

                    <div>
                        <h2>
                        <FormattedHTMLMessage id="ProposalView.average" defaultMessage="AVERAGE"/>
                        </h2>
                        {avg_table}
                    </div>

                </div>
        );
    }
}

ElementDetail.propTypes = {
    data: PropTypes.object.isRequired,
    open: PropTypes.bool,
    withLosses: PropTypes.bool,
    colors: PropTypes.object,
    avg_info: PropTypes.object,
};
