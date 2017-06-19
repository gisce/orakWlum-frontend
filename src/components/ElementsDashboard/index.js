import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Calendar from 'material-ui/DatePicker/Calendar';
import {dateTimeFormat} from 'material-ui/DatePicker/dateUtils';
import {List, ListItem} from 'material-ui/List';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import DatePicker from 'material-ui/DatePicker';

import AutoComplete from 'material-ui/AutoComplete';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import { ProposalList } from '../ProposalList';

import { date_to_string} from '../../utils/misc';

import { debug } from '../../utils/debug';
import { dispatchNewRoute} from '../../utils/http_functions';

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
        this.todayDate.setHours(0);
        this.todayDate.setMinutes(0);
        this.todayDate.setSeconds(0);

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
            selected_enddate: Object.assign(this.todayDate),
            selected_type: this.filter_types[0].text,
            searchText: this.filter_types[0].text,
            selectedElements: {},
            multiElementMode: false, //select
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

    //Date formatter
    formatDate = (date) => {
        return date_to_string(date).replace(/\//g, " / ");
    }

    //Enddate update with lite validation
    updateEndDate = (event, date) => {
        (date >= this.state.selected_date) &&
            this.setState({
              selected_enddate: date,
            });
    };

    //Change the type
    updateType = (value) => {
        this.setState({
            selected_type: value,
            searchText: value,
        });
    };

    //Toggle multiElementMode flag
    toggleMultiElementSelection = () => {
        this.setState({
            multiElementMode: !this.state.multiElementMode,
        });
    }

    //Toggle selection of element
    toggleSelectElement = (element, title) => {
        (element in this.state.selectedElements) ?
            this.unselectElement(element)
            :
            this.selectElement(element, title)
    }

    //Dispatch two elements comparation
    compareSelectedElements = () => {
        const {selectedElements} = this.state;

        let compare_location = '/compare'
        if (Object.keys(selectedElements).length == 2){
            for ( let [key, value] of Object.entries(selectedElements)) {
                compare_location += "/" + key;
            }
            dispatchNewRoute(compare_location);
        }
    }

    //Select an element
    selectElement = (element, title) => {
        let currentElements = this.state.selectedElements;
        currentElements[element] = title;

        this.setState({
            selectedElements: currentElements,
        });

    }

    //unSelect an element
    unselectElement = (element) => {
        console.log("unselecting", element)
        let currentElements = this.state.selectedElements;
        delete currentElements[element];

        this.setState({
            selectedElements: currentElements,
        });
    }

    render = () => {
        const {elements, aggregations} = this.props;
        const {selected_date, selected_enddate, selected_type, searchText, selectedElements, multiElementMode} = this.state;
        const selected_date_string = date_to_string(selected_date).replace(/\//g, " / ");
        const selected_enddate_string = date_to_string(selected_enddate).replace(/\//g, " / ");

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
                          floatingLabelText={"Initial date"}
                          multiLine={false}
                          fullWidth={false}
                          rowsMax={1}
                          value={selected_date_string}
                          onChange={(value) => this.updateDate(value.target.value)}
                        />
                    </div>
                </div>

                <div className="row" style={styles.row}>
                    <div ref="selected_enddate" className="col-md-12">
                        <DatePicker
                            floatingLabelText={"Ending date"}
                            container="inline"
                            mode="landscape"
                            autoOk={true}
                            value={selected_enddate}
                            onChange={this.updateEndDate}
                            formatDate={this.formatDate}
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
                    <div ref="selected_type" className="col-md-12">
                        <RaisedButton
                            label="Select Mode"
                            onClick={(value) => this.toggleMultiElementSelection()}
                            primary={multiElementMode}
                        />
                    </div>
                </div>

                <div className="row" style={styles.row}>
                    <div ref="selected_type" className="col-md-12">
                        <RaisedButton
                            label="Compare"
                            onClick={(event) => this.compareSelectedElements()}
                            disabled={!multiElementMode || Object.keys(selectedElements).length != 2}
                        />
                    </div>
                </div>
            </div>
        )

        // The elements
        let elements_matched = [];

        //const date_scope = date_to_string(selected_date, "%Y-%m-%d");
        //const dateend_scope = date_to_string(selected_enddate, "%Y-%m-%d");
        const type_scope = (selected_type == "All")? null : (selected_type == "Historical")? true : false;

        elements.map( function (element, index){
            let matched=false;

            //Review days_range
            const date_match = element.days_range.map (function (a_day, index_day) {
                const element_date = new Date(a_day);
                let extended_enddate = new Date( selected_enddate)
                extended_enddate.setHours( selected_enddate.getHours() + 12);

                if (selected_date <= element_date && element_date <= extended_enddate ) {
                    return true;
                }
            });

            //Review days_range_future if so far not matched
            if (date_match.indexOf(true) != -1) {
                matched = true;
            }


            // try it (historicals don't have days_range_future)
            try {
                //Review days_range_future
                const future_date_match = element.days_range_future.map (function (a_day, index_day) {
                    const element_date = new Date(a_day);

                    let extended_enddate = new Date( selected_enddate)
                    extended_enddate.setHours( selected_enddate.getHours() + 12);

                    if (selected_date <= element_date && element_date <= extended_enddate ){
                        return true;
                    }
                });

                if (future_date_match.indexOf(true) != -1) {
                    matched = true;
                }
            }
            catch (err) {
            }

            //Match type (just if date match and type is not "All" (null))
            if (matched && type_scope != null) {
                if (element.historical == type_scope)
                    matched = true;
                else
                    matched = false;
            }

            element.selected = (element.id in selectedElements)?
                true
                :
                false

            //Save matched result
            matched &&
                elements_matched.push(element);

        });


        // Matched elements rendered in a <ProposalList> (with overrided onClick if needed)
        const the_elements = (
            (multiElementMode)?
                <ProposalList
                    title="Matched elements"
                    proposals={elements_matched}
                    aggregations={aggregations}
                    path={"/elements"}
                    sameWidth={true}
                    width={"small"}
                    onClick={(element, title) => this.toggleSelectElement(element, title)}
                />
                :
                <ProposalList
                    title="Matched elements"
                    proposals={elements_matched}
                    aggregations={aggregations}
                    path={"/elements"}
                    sameWidth={true}
                    width={"small"}
                />
        )


        // Selected Elements list
        let selectedElementsList = [];
        for ( let [key, value] of Object.entries(selectedElements)) {
            selectedElementsList.push(
                <ListItem
                    key={key}
                    primaryText={value}
                    rightIcon={<DeleteIcon onClick={(event) => this.unselectElement(key)}/>}
                />
            );
        }



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

            {
                //Render selectedElements if exist
                (!multiElementMode) ?

                <div className="row" style={styles.row}>
                    <div ref="the_elements" className="col-md-12">
                        {the_elements}
                    </div>
                </div>

                :

                <div className="row" style={styles.row}>
                    <div ref="the_elements" className="col-md-9">
                        {the_elements}
                    </div>

                    <div ref="the_selected_elements" className="col-md-3">
                        <h3>Selected Elements</h3>
                        <List>
                            {selectedElementsList}
                        </List>
                    </div>
                </div>
            }

            </div>
        );
    }
}

ElementsDashboard.propTypes = {
    elements: PropTypes.array.isRequired,
    aggregations: PropTypes.object.isRequired,
};
