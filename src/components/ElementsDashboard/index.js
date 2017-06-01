import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Calendar from 'material-ui/DatePicker/Calendar';
import {dateTimeFormat} from 'material-ui/DatePicker/dateUtils';

import AutoComplete from 'material-ui/AutoComplete';

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
        };
    }

    selectDay = (event ,date) => {
        const the_date = new Date(date);

        // Force update the selected date in the <Calendar>
        this.calendar_settings.initialDate = date;

        // Save it as current state
        this.setState({
          selected_date: the_date,
        });
    };


    selectToday = (event) => {
        this.selectDay(event, this.todayDate);
    };

    selectOneYearAgo = (event) => {
        this.selectDay(event, this.oneYearAgoDate);
    };

    selectType = (value) => {
        this.setState({
            selected_type: value,
        });
    };

    render = () => {

        const {elements, aggregations} = this.props;
        const {selected_date, selected_type} = this.state;
        const selected_date_string = date_to_string(selected_date);

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



        const the_filters = (
            <div>
                <div className="row" style={styles.row}>
                    <div ref="selected_date" className="col-md-12">
                        <strong>Selected day</strong>:&nbsp;
                        {
                            selected_date && (
                                selected_date_string
                            )
                        }
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
                          onUpdateInput={(value) => this.selectType(value)}
                        />
                    {selected_type}
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
