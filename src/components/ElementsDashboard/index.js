import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Calendar from 'material-ui/DatePicker/Calendar';
import {dateTimeFormat} from 'material-ui/DatePicker/dateUtils';

import AutoComplete from 'material-ui/AutoComplete';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

import { ProposalList } from '../ProposalList';

import { date_to_string} from '../../utils/misc';

import * as actionCreators from '../../actions/elements';

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
            searchText: value,
        });
    };

    selectElement = (element) => {
        this.setState({
            selectedElements: {
                ...this.state.elements,
                element
            },
        });
    }

    render = () => {
        const {elements, aggregations} = this.props;
        const {selected_date, selected_type, searchText} = this.state;
        const selected_date_string = date_to_string(selected_date).replace(/\//g, " / ");

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

        // The actions to apply
        const the_actions = (
            <div>
                <div className="row" style={styles.row}>
                    <div ref="selected_date" className="col-md-12">
                        <TextField
                          floatingLabelText={"Due to date"}
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
                        <FlatButton
                            label="Multielement selection"
                            onClick={(value) => this.updateDate(value.target.value)}
                        />
                    </div>
                </div>
            </div>
        )

        // The elements
        let elements_matched = [];

        const date_scope = date_to_string(selected_date, "%Y-%m-%d");
        const type_scope = (selected_type == "All")? null : (selected_type == "Historical")? true : false;

        elements.map( function (element, index){
            let matched=false;

            //Review days_range
            const date_match = element.days_range.map (function (a_day, index_day) {
                if (date_scope == a_day)
                    return true;
            });

            //Review days_range_future if so far not matched
            if (date_match.indexOf(true) != -1) {
                matched = true;
            }
            else {
                // try it (historicals don't have days_range_future)
                try {
                    //Review days_range_future
                    const future_date_match = element.days_range_future.map (function (a_day, index_day) {
                        if (date_scope == a_day)
                            return true;
                    });

                    if (future_date_match.indexOf(true) != -1) {
                        matched = true;
                    }
                }
                catch (err) {
                    matched = false;
                }
            }

            //Match type (just if date match and type is not "All" (null))
            if (matched && type_scope != null) {
                if (element.historical == type_scope)
                    matched = true;
                else
                    matched = false;
            }

            //Save matched result
            matched &&
                elements_matched.push(element);

        });

        const the_elements = (
            <ProposalList
                title="Matched elements"
                proposals={elements_matched}
                aggregations={aggregations}
                path={"/elements"}
                sameWidth={true}
                width={"small"}
                onClick={(element) => console.log(element)}
            />
        )

        // The render result
        return (
            <div>
                <div className="row" style={styles.row}>
                    <div ref="the_calendar" className="col-md-6">
                        {the_calendar}
                    </div>

                    <div ref="the_filters" className="col-md-3">
                        <h3>Filters</h3>
                        {the_filters}
                    </div>

                    <div ref="the_calendar" className="col-md-3">
                        <h3>Actions</h3>
                        {the_actions}
                    </div>

                </div>

                <div className="row" style={styles.row}>
                    <div ref="the_elements" className="col-md-12">
                        {the_elements}
                    </div>
                </div>
            </div>
        );
    }
}

ElementsDashboard.propTypes = {
    elements: PropTypes.array.isRequired,
    aggregations: PropTypes.object.isRequired,
};
