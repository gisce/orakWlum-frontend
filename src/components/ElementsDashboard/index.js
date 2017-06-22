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
import Divider from 'material-ui/Divider';

import { ProposalList } from '../ProposalList';
import { ContentHeader } from '../ContentHeader';

import { date_to_string} from '../../utils/misc';

import { debug } from '../../utils/debug';
import { dispatchNewRoute} from '../../utils/http_functions';

import * as actionCreators from '../../actions/orakwlum';

const styles = {
    calendar: {
    },

    row: {
        marginTop: 20,
    }

};

function mapStateToProps(state) {
    return {
        elements: state.orakwlum.elements,
        aggregations: state.orakwlum.aggregations,
        elements_by_date: state.orakwlum.elements_by_date,
        elements_by_type: state.orakwlum.elements_by_type,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export class ElementsDashboard extends Component {
    constructor(props) {
        super(props);

        this.todayDate = new Date("2016/03/01");
        this.todayDate.setDate(1);
        this.todayDate.setHours(0);
        this.todayDate.setMinutes(0);
        this.todayDate.setSeconds(0);

        this.oneYearAgoDate = new Date(new Date().setFullYear(this.todayDate.getFullYear() - 1));

        this.endingDate = new Date(new Date(this.todayDate).setMonth(this.todayDate.getMonth()+1));
        this.endingDate.setDate(-1 + 1);

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
            selected_enddate: this.endingDate,
            selected_type: this.filter_types[0].text,
            searchText: this.filter_types[0].text,
            selectedElements: {},
            multiElementMode: false, //select
            elements_matched: [],
        };

        this.selected_date = this.todayDate
        this.selected_enddate = this.endingDate
        this.selected_type = this.filter_types[0].text
    }

    componentWillMount() {
        //Filter elements
        this.filterElements()
    }

    refreshData(silent = true) {
        const the_filter = null;
        const override = false;

        this.props.fetchAggregations(the_filter, silent);
        this.props.refreshElements(the_filter, silent, override);
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

        this.selected_date = the_date
        //Force a elements refiltering
        this.filterElements()
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

        //Force a elements refiltering
        this.filterElements()
    };

    //Date formatter
    formatDate = (date) => {
        return date_to_string(date).replace(/\//g, " / ");
    }

    //Date formatter
    formatDateFromAPI = (date) => {
        return date_to_string(date, "%Y-%m-%d");
    }

    //Enddate update with lite validation
    updateEndDate = (event, date) => {
        if (date >= this.selected_date){
            this.selected_enddate = date;

            this.setState({
              selected_enddate: date,
            });

            this.filterElements()
        }
    };

    //Change the type
    updateType = (value) => {
        this.setState({
            selected_type: value,
            searchText: value,
        });

        this.selected_type = value

        //Force a elements refiltering
        this.filterElements()
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

        let location = '/compare'
        if (Object.keys(selectedElements).length == 2){
            for ( let [key, value] of Object.entries(selectedElements)) {
                location += "/" + key;
            }
            dispatchNewRoute(location);
        }
    }

    //Dispatch an elements concatenation
    concatenateSelectedElements = () => {
        const {selectedElements} = this.state;

        let location = '/concatenate';
        let separator = "/"

        for ( let key of Object.keys(selectedElements)) {
            location += separator + key;
            separator = ","
        }
        dispatchNewRoute(location);
    }

    //Select an element
    selectElement = (element, title) => {
        let currentElements = this.state.selectedElements;
        currentElements[element] = title;

        let elements_matched = this.state.elements_matched;
        elements_matched[element].selected = true

        this.setState({
            selectedElements: currentElements,
        });



        //currentElements[element].selected = true;

    }

    //unSelect an element
    unselectElement = (element) => {
        let currentElements = this.state.selectedElements;
        let elements_matched = this.state.elements_matched;
        elements_matched[element].selected = false

        delete currentElements[element];

        this.setState({
            selectedElements: currentElements,
        });
    }

    //unSelect all elements
    unselectAllElements = () => {
        this.setState({
            selectedElements: [],
        });
    }

    filterElements = () => {
        const {elements, elements_by_date, elements_by_type} = this.props;
        const {selected_date, selected_enddate, selected_type} = this;
        const {selectedElements} = this.state;


        console.debug("filterElements", selected_date, selected_enddate, selected_type)

        // The elements
        let elements_matched = [];

        // Initialize dates
        let current_date = new Date(selected_date);
        const end_date = new Date(selected_enddate);

        //Parse to lower selected_type (to match API ids)
        const selected_type_id = selected_type.toLowerCase();

        //For each candidate day
        while (current_date <= end_date) {
            const current_date_str = this.formatDateFromAPI(current_date);
            if (current_date_str in elements_by_date) {
                const elements_for_current_date = elements_by_date[current_date_str];

                //Fetch all elements for current_day
                for ( let [id, element] of Object.entries(elements_for_current_date)) {
                    //Validate type
                    if (selected_type_id == "all" || element.element_type == selected_type_id) {
/*                         element.selected = (element.id in selectedElements)?
                            true
                            :
                            false;
 */
                        elements_matched.push(element);
                    }
                }
            }

            //+1 day
            const current_date_tmp = current_date.getDate()
            current_date.setDate(current_date_tmp + 1);
        }

        //Save matched elements
        this.setState({
            elements_matched,
        })
    }

    render = () => {
        const {aggregations} = this.props;
        const {selected_date, selected_enddate, selected_type, searchText, selectedElements, multiElementMode, elements_matched} = this.state;
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
                            label="Concatenate"
                            onClick={(event) => this.concatenateSelectedElements()}
                            disabled={!multiElementMode || Object.keys(selectedElements).length <= 1}
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




        // Matched elements rendered in a <ProposalList> (with overrided onClick if needed)
        const the_elements = (
            (multiElementMode)?
                <ProposalList
                    title="Matched elements"
                    proposals={elements_matched}
                    aggregations={aggregations}
                    sameWidth={true}
                    width={"small"}
                    onClick={(element, title) => this.toggleSelectElement(element, title)}
                />
                :
                <ProposalList
                    title="Matched elements"
                    proposals={elements_matched}
                    aggregations={aggregations}
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
                <ContentHeader
                    title="Elements"
                    addButton={true}
                    addClickMethod={(event) => this.addHistorical(event)}

                    refreshButton={true}
                    refreshClickMethod={() => this.refreshData()}
                />

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
                            {
                                (selectedElementsList.length > 0) &&
                                    (
                                        <div>
                                            <ListItem
                                                key={"unSelectAllElementsListItem"}
                                                primaryText={"Clear list"}
                                                onClick={(event) => this.unselectAllElements()}
                                            />
                                            <Divider />
                                        </div>
                                    )
                            }
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
};
