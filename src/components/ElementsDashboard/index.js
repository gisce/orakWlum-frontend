import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Calendar from 'material-ui/DatePicker/Calendar';
import {dateTimeFormat} from 'material-ui/DatePicker/dateUtils';

import AutoComplete from 'material-ui/AutoComplete';
import TextField from 'material-ui/TextField';

import { dispatchNewRoute} from '../../utils/http_functions';
import { date_to_string} from '../../utils/misc';

import * as actionCreators from '../../actions/proposals';


const styles = {
    calendar: {
    },

    row: {
        marginTop: 20,
    }

};

function mapStateToProps(state) {
    return {
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export class ElementsDashboard extends Component {
    constructor(props) {
        super(props);

        this.todayDate = new Date();
        this.oneYearAgoDate = new Date(new Date().setFullYear(this.todayDate.getFullYear() - 1));

        const DateTimeFormat = global.Intl.DateTimeFormat;

        this.calendar_settings = {
            locale: 'en-ES',

            okLabel: 'Today',
            cancelLabel: 'One Year Ago',

            initialDate: this.todayDate,

            firstDayOfWeek: 1,
            dateTimeFormat: DateTimeFormat,

            mode: "landscape",
            container: "inline",

            style: styles.calendar,
        };


        // The available filter types
        this.filter_types = [
              {text: 'All', value: 'all'},
              {text: 'Proposal', value: 'proposal'},
              {text: 'Historical', value: 'historical'},
        ];

        this.state = {
            selected_date: this.todayDate,
            selected_type: this.filter_types[0].text,
            searchText: this.filter_types[0].text,
        };
    }

    //Save the date state and force the <Calendar> update
    selectDay = (event ,date) => {
        const the_date = new Date(date);

        // Force update the selected date in the <Calendar>
        this.calendar_settings.initialDate = date;

        // Save it as current state
        this.setState({
          selected_date: the_date,
        });
    };

    //Select today date
    selectToday = (event) => {
        this.selectDay(event, this.todayDate);
    };

    //Select one year ago!
    selectOneYearAgo = (event) => {
        this.selectDay(event, this.oneYearAgoDate);
    };

    //Manual date update
    updateDate = (value) => {
        const parsed_date = value.replace(/ /g,'').split("/");
        const desired_date = new Date(parsed_date[1] + " " + parsed_date[0] + " " + parsed_date[2]);

        this.selectDay(null, desired_date);
    };

    //Change the type
    updateType = (value) => {
        this.setState({
            selected_type: value,
            searchText: "Proposal",
        });
    };

    render = () => {
        const {elements, aggregations} = this.props;
        const {selected_date, selected_type, searchText} = this.state;
        const selected_date_string = date_to_string(selected_date).replace(/\//g, " / ");

        console.log(elements);
        console.log(aggregations);

        // The calendar selector
        const the_calendar = (
            <Calendar
                initialDate = {this.calendar_settings.initialDate}

                locale = {this.calendar_settings.locale}
                firstDayOfWeek = {this.calendar_settings.firstDayOfWeek}
                DateTimeFormat = {this.calendar_settings.dateTimeFormat}

                ref = "calendar"
                open = {true}

                mode = {this.calendar_settings.mode}
                container = {this.calendar_settings.container}

                style = {this.calendar_settings.style}

                onTouchTapDay={this.selectDay}

                okLabel={this.calendar_settings.okLabel}
                onTouchTapOk={this.selectToday}

                cancelLabel={this.calendar_settings.cancelLabel}
                onTouchTapCancel={this.selectOneYearAgo}
            />

        );

        // The filter to apply
        const the_filters = (
            <div>
                <div className="row" style={styles.row}>
                    <div ref="selected_date" className="col-md-12">
                        <TextField
                          floatingLabelText={"Selected date"}
                          multiLine={false}
                          fullWidth={false}
                          rowsMax={1}
                          value={selected_date_string}
                          onChange={(value) => this.updateDate(value.target.value)}
                        />
                    </div>
                </div>

                <div className="row" style={styles.row}>
                    <div ref="selected_type" className="col-md-12">
                        <AutoComplete
                          floatingLabelText={"Type"}
                          filter={AutoComplete.noFilter}
                          openOnFocus={true}
                          dataSource={this.filter_types}
                          value={selected_type}
                          onUpdateInput={(value) => this.updateType(value)}
                          searchText={searchText}
                        />
                    </div>
                </div>
            </div>
        )

        // The render result
        return (
            <div className="row" style={styles.row}>

                <div ref="the_calendar" className="col-md-8">
                    {the_calendar}
                </div>
                <div ref="the_calendar" className="col-md-4">
                    {the_filters}
                </div>

            </div>
        );
    }
}

ElementsDashboard.propTypes = {
    elements: React.PropTypes.array.isRequired,
    aggregations: React.PropTypes.object.isRequired,

};
