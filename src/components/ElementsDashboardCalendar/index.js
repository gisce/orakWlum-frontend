import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import moment from 'moment';

import BigCalendar from 'react-big-calendar';
require('style!css!react-big-calendar/lib/css/react-big-calendar.css');

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

import { orange300, orange900, green300, green900, red300, red900, blue300, blue900 } from 'material-ui/styles/colors'


//Define the localizer for the Calendar
BigCalendar.momentLocalizer(moment);
moment.locale('es');


const styles = {
    calendar: {
    },

    row: {
        marginTop: 20,
        verticalAlign: 'bottom !important',
    },
    actions: {
        marginTop: 27,
    },
    element_style: {
        'green': { backgroundColor: green900, borderColor: '#777' },
        'blue': { backgroundColor: blue900, borderColor: '#777' },
        'red': { backgroundColor: red900, borderColor: '#777' },
        'default': { backgroundColor: orange900, borderColor: '#777' },
    }

};

function mapStateToProps(state) {
    return {
        elements: state.orakwlum.elements,
        aggregations: state.orakwlum.aggregations,
        elements_by_date: state.orakwlum.elements_by_date,
        elements_by_date_future: state.orakwlum.elements_by_date_future,
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
        this.todayDate = new Date();
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
              {text: 'Concatenation', value: 'concatenation'},
              {text: 'Comparation', value: 'comparation'},
        ];

        this.selected_date = this.todayDate
        this.selected_enddate = this.endingDate

        switch(this.props.path) {
            case "/elements/type/proposal":
                this.selected_type = "proposal"
                this.selected_type_search = "Proposal"
                break;;

            case "/elements/type/historical":
                this.selected_type = "historical"
                this.selected_type_search = "Historical"
                break;;

            default:
                this.selected_type = this.filter_types[0].text
                this.selected_type_search = this.filter_types[0].text
        }

        this.state = {
            selected_date: this.todayDate,
            selected_enddate: this.endingDate,
            selected_type: this.selected_type,
            searchText: this.selected_type_search,
            selectedElements: {},
            multiElementMode: false, //select
            elements_matched: [],
        };

        const {aggregations, elements} = this.props;

        if (Object.keys(aggregations).length == 0 || Object.keys(elements).length == 0)
            this.refreshData()
    }


    componentDidMount() {
        //Filter elements
        this.filterElements()
    }

    addElement(event) {
        dispatchNewRoute("/elements/new", event);
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
    toggleSelectElement = (count, element, title) => {
        //console.log("toggle", count, element, title);
        (element in this.state.selectedElements) ?
            this.unselectElement(count, element)
            :
            this.selectElement(count, element, title)
    }

    //Dispatch two elements comparation
    compareSelectedElements = () => {
        const {selectedElements} = this.state;

        let location = '/elements/compare'
        if (Object.keys(selectedElements).length == 2){
            for ( let [key, value] of Object.entries(selectedElements)) {
                location += "/" + key;
            }
            this.unselectAllElements()
            dispatchNewRoute(location);
        }
    }

    //Dispatch an elements concatenation
    concatenateSelectedElements = () => {
        const {selectedElements} = this.state;

        let location = '/elements/concatenate';
        let separator = "/"

        for ( let key of Object.keys(selectedElements)) {
            location += separator + key;
            separator = ","
        }

        this.unselectAllElements()
        dispatchNewRoute(location);
    }

    //Select an element
    selectElement = (count, element, title) => {
        let currentElements = this.state.selectedElements;
        currentElements[element] = title;

        let elements_matched = this.state.elements_matched;
        elements_matched[count].selected = true

        this.setState({
            selectedElements: currentElements,
            elements_matched,
        });

        //currentElements[element].selected = true;

    }

    //unSelect an element
    unselectElement = (count, element) => {
        let currentElements = this.state.selectedElements;
        let elements_matched = this.state.elements_matched;
        elements_matched[count].selected = false

        delete currentElements[element];

        this.setState({
            selectedElements: currentElements,
            elements_matched,
        });
    }

    //unSelect all elements
    unselectAllElements = () => {
        let elements_matched = this.state.elements_matched;

        // Unselect all matched elements
        for ( let [key, value] of Object.entries(elements_matched)) {
            value.selected = false;
        }

        this.setState({
            selectedElements: [],
            elements_matched,
        });
    }

    filterElements = () => {
        const {elements, elements_by_date, elements_by_date_future, elements_by_type} = this.props;
        const {selected_date, selected_enddate, selected_type} = this;
        const {selectedElements} = this.state;

        console.debug("filteringElements", selected_date, selected_enddate, selected_type)

        // The elements
        let elements_matched = [];

        //Parse to lower selected_type (to match API ids)
        const selected_type_id = selected_type.toLowerCase();

        //Validate type
		for ( let [id, element] of Object.entries(elements)) {
            if (selected_type_id == "all" || element.element_type == selected_type_id) {
                elements_matched.push(element);
            }
        }

        //Save matched elements
        this.setState({
            elements_matched,
        })
    }

    colorizeEvents(e) {
        let color;

        const element_style = styles['element_style']

        switch (e.type){
            case 'historical':
                color = element_style['red'];
                break;

            case 'proposal':
                color = element_style['blue'];
                break;

            default:
                color = element_style['default']
        }

        return { style: color }
    }

    render = () => {
        const {selected_type, searchText, selectedElements, multiElementMode, elements_matched} = this.state;

        // The filters
        const the_filters = (
            <div>
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
        )

        // The actions
        const the_actions = (
            <div>
                    <div ref="selected_type" className="col-md-4">
                        <RaisedButton
                            label="Select Mode"
                            onClick={(value) => this.toggleMultiElementSelection()}
                            primary={multiElementMode}
                        />
                    </div>
                    <div ref="selected_type" className="col-md-4">
                        <RaisedButton
                            label="Concatenate"
                            onClick={(event) => this.concatenateSelectedElements()}
                            disabled={!multiElementMode || Object.keys(selectedElements).length <= 1}
                        />
                    </div>

                    <div ref="selected_type" className="col-md-4">
                        <RaisedButton
                            label="Compare"
                            onClick={(event) => this.compareSelectedElements()}
                            disabled={!multiElementMode || Object.keys(selectedElements).length != 2}
                        />
                    </div>
            </div>
        )

        // Selected Elements list
        let selectedElementsList = [];
        let count=0;
        for ( let [key, value] of Object.entries(selectedElements)) {
            selectedElementsList.push(
                <ListItem
                    key={key}
                    primaryText={value}
                    rightIcon={<DeleteIcon onClick={(event) => this.unselectElement(count, key)}/>}
                />
            );
            count++;
        }

        // The events (parsed)
        let events = [];
        count=0;
        for ( let [key, value] of Object.entries(elements_matched)) {
            //console.log(value);

            let an_entry = {
                'title': value.name,
                'allDay': true,
                'url': value.url,
                'type': (value.historical)?"historical":"proposal",
                count,
                'id': value.id,
            }

            let start_date, end_date;
            // If that's a proposal
            if (!value.historical) {
                //add entry to the past
                let past_entry = Object.assign({}, an_entry)
                start_date = value.days_range[0]
                end_date = (value.days_range.length == 1)? start_date : value.days_range[1]
                past_entry['start'] = moment(start_date),
                past_entry['end'] = moment(end_date),
                events.push(past_entry);

                //add entry to the future!
                start_date = value.days_range_future[0]
                end_date = (value.days_range_future.length == 1)? start_date : value.days_range_future[1]

            } else {
                start_date = value.days_range[0]
                end_date = (value.days_range.length == 1)? start_date : value.days_range[1]
            }

            an_entry['start'] = moment(start_date),
            an_entry['end'] = moment(end_date),

            events.push(an_entry);

            count++;
        }

        // The calendar
        const the_calendar =
            <BigCalendar
              selectable={(multiElementMode)?false:true}
              events={events}
              defaultView='month'
              scrollToTime={new Date(1970, 1, 1, 6)}
              defaultDate={this.calendar_settings.initialDate}
              popup={true}
              views={['month']}
              eventPropGetter={e => this.colorizeEvents(e)}
              onSelectEvent={(multiElementMode)? (element) => this.toggleSelectElement(element.count, element.id, element.title) : (event) => dispatchNewRoute(event.url)}
              onSelectSlot={(slotInfo) => alert(
                `selected slot: \n\nstart ${slotInfo.start.toLocaleString()} ` +
                `\nend: ${slotInfo.end.toLocaleString()}`
              )}
            />;

        // The render result
        return (
            <div>
                <ContentHeader
                    title="Elements"
                    addButton={true}
                    addClickMethod={(event) => this.addElement(event)}

                    refreshButton={true}
                    refreshClickMethod={() => this.refreshData()}
                />

                <div className="row" style={styles.row}>
                    <div ref="the_filters" className="col-md-4">
                        {the_filters}
                    </div>

                    <div ref="the_actions" className="col-md-8" style={styles.actions}>
                        {the_actions}
                    </div>
                </div>

            {
                //Render selectedElements if exist
                (!multiElementMode) ?

                <div className="row" style={styles.row}>
                    <div ref="the_elements" className="col-md-12">
                        {the_calendar}
                    </div>
                </div>

                :

                <div className="row" style={styles.row}>
                    <div ref="the_elements" className="col-md-9">
                        {the_calendar}
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
