import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


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
import FlatButton from 'material-ui/FlatButton';

import Dialog from 'material-ui/Dialog';

import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';

import { ElementList } from '../ElementList';
import { ContentHeader } from '../ContentHeader';

import { capitalize} from '../../utils/misc';

import { debug } from '../../utils/debug';
import { dispatchNewRoute} from '../../utils/http_functions';

import * as actionCreators from '../../actions/orakwlum';

import { localized_time, colors_combo, colors_by_elements_type } from '../../constants'

//Define the localizer for the Calendar
BigCalendar.momentLocalizer(localized_time);

const styles = {
    calendar: {
    },

    row: {
        marginTop: 20,
        verticalAlign: 'bottom !important',
    },
    rowCalendar: {
        marginTop: 50,
        verticalAlign: 'bottom !important',
        height: "60%",
    },
    actions: {
        marginTop: 27,
    },
    element_style: colors_combo,
    alignLeft: {
        textAlign: 'left',
    },
    alignCenter: {
        textAlign: 'center',
    },
    alignRight: {
        textAlign: 'right',
    },
    calendarNavigationButtons: {
        minWidth: 50,
    },
    calendarNavigation: {
    },
    calendarLabel: {
      paddingLeft: 32,
      paddingRight: 0,
      color: "black",
    },
    calendarLegend: {
    },
    calendarLegendEntry: {
        color: "black",
        verticalAlign: 'middle',
        minWidth: 50,
        //padding: 5,
        //paddingLeft: 10,
        //paddingRight: 10,
        fontWeight: "bold",
    },
};

function mapStateToProps(state) {
    return {
        calendar_date: state.orakwlum.calendar_date,
        elements: state.orakwlum.elements,
        aggregations: state.orakwlum.aggregations,
        elements_by_date: state.orakwlum.elements_by_date,
        elements_by_date_past: state.orakwlum.elements_by_date_past,
        elements_by_type: state.orakwlum.elements_by_type,
        elements_volatile: state.orakwlum.elements_volatile,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export class ElementsDashboard extends Component {
    constructor(props) {
        super(props);
        this.todayDate = (typeof props.calendar_date  === "string") ?
                new Date(props.calendar_date): props.calendar_date;

        this.calendar_settings = {
            initialDate: this.todayDate,
            views: ['month'],
            defaultView: 'month',
            popup: true,
        };

        // The available filter types
        this.filter_types = [
              {text: 'All', value: 'all'},
              {text: 'Proposal', value: 'proposal'},
              {text: 'Historical', value: 'historical'},
              {text: 'Concatenation', value: 'concatenation'},
              {text: 'Comparation', value: 'comparation'},
        ];

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

        this.elements_matched = [];

        this.state = {
            selected_type: this.selected_type,
            searchText: this.selected_type_search,
            selectedElements: {},
            multiElementMode: false, //select
            creation_dialog_open: false, //create dialog status
        };


        this.creation_dialog = {
            title: "Create new element?",
            body: "Did you want to create a new Element",
        };

        const {aggregations, elements} = this.props;

        if (Object.keys(aggregations).length == 0 || Object.keys(elements).length == 0)
            this.refreshData()
    }

    addElement = (event, days_range="") => {
        dispatchNewRoute("/elements/new" + "/" + days_range, event);
    }

    refreshData = (silent = true) => {
        const the_filter = null;
        const override = false;

        this.props.fetchAggregations(the_filter, silent);
        this.props.refreshElements(the_filter, silent, override);
    }

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

        this.elements_matched[count].selected = true

        this.setState({
            selectedElements: currentElements,
        });

        //currentElements[element].selected = true;
    }

    //unSelect an element
    unselectElement = (count, element) => {
        let currentElements = this.state.selectedElements;
        this.elements_matched[count].selected = false

        delete currentElements[element];

        this.setState({
            selectedElements: currentElements,
        });
    }

    //unSelect all elements
    unselectAllElements = () => {
        // Unselect all matched elements
        for ( let [key, value] of Object.entries(this.elements_matched)) {
            value.selected = false;
        }

        this.setState({
            selectedElements: [],
        });
    }

    // Filter elements based on the selected type
    filterElements = () => {
        const {elements, elements_by_date, elements_by_date_past, elements_by_type, elements_volatile} = this.props;
        const {selected_type} = this;
        const {selectedElements} = this.state;

        console.debug("filteringElements", selected_type)

        // The elements
        this.elements_matched = [];

        //Parse to lower selected_type (to match API ids)
        const selected_type_id = selected_type.toLowerCase();

        //Set scope depending on the type
        let elements_scope;
        switch (selected_type_id) {
            case "all":
                elements_scope = elements;
                break;

            default:
                if (selected_type_id in elements_by_type)
                    elements_scope = elements_by_type[selected_type_id];
                else
                    elements_scope = [];
        }

        //Adapt data to needed array
		for ( let [id, element] of Object.entries(elements_scope)) {
            this.elements_matched.push(element);
        }

        if (elements_volatile) {
            //Validate type for volatile elements
    		for ( let [id, element] of Object.entries(elements_volatile)) {
                if (selected_type_id == "all" || element.element_type == selected_type_id) {
                    this.elements_matched.push(element);
                }
            }
        }
    }


    creation_dialog_close = () => {
        this.setState({
            creation_dialog_open: false,
        })
    }

    // Identify a Range of Dates and ask the user about to create a new element
    setRangeOfDates = (range) => {
        const start_hour = localized_time(range.start)
        const end_hour = localized_time(range.end)

        const range_string = (start_hour.isSame(end_hour))?
            " for '" + start_hour.format("L") + "'"
            :
            " between '" + start_hour.format("L") + " - " + end_hour.format("L") + "'"
        ;

        //rolferrr

        this.creation_dialog['body'] += range_string;
        this.creation_dialog['days_range'] = start_hour.format("DDMMYYYY") + "/" + end_hour.format("DDMMYYYY");

        // The object to handle the creation dialog
        const creation_dialog_actions = [
          <FlatButton
            label="Cancel"
            primary={true}
            onClick={() => this.creation_dialog_close()}
          />,
          <FlatButton
            label="Submit"
            primary={true}
            keyboardFocused={true}
            onClick={(event) => this.addElement(event, this.creation_dialog['days_range'])}
          />,
        ];
        this.creation_dialog['actions'] = creation_dialog_actions;

        this.setState({
            creation_dialog_open: true,
        });
    }

    colorizeEvents = (e) => {
        let color;
        const element_style = styles['element_style'];
        let current_type = e.type;
        let class_name = "";

        if (current_type == 'proposal') {
            class_name = current_type + e.status['lite'];
        }

        if (!(current_type in colors_by_elements_type))
            color = element_style[colors_by_elements_type['default']];
        else
            color = element_style[colors_by_elements_type[current_type]];

        return { style: color, className: class_name }
    }

    render = () => {
        const {selected_type, searchText, selectedElements, multiElementMode} = this.state;

        // Filter elements by current criteria with current target elements
        this.filterElements();
        const elements_matched = this.elements_matched;

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
            let name = value.name;
            if (name.length>30) {
                name = name.substring(0,30)+"...";
            }

            let an_entry = {
                'title': name,
                'allDay': true,
                'url': value.url,
                'type': value.element_type,
                count,
                'id': value.id,
                'status': value.status,
            }

            let start_date, end_date;

            // If that's a proposal
            if (value.element_type == "proposal") {
                //add entry to the past
                let past_entry = Object.assign({}, an_entry)
                start_date = value.days_range[0]
                end_date = (value.days_range.length == 1)? start_date : value.days_range[1]
                past_entry['start'] = localized_time(start_date),
                past_entry['end'] = localized_time(end_date),
                events.push(past_entry);

                //add entry to the past!
                start_date = value.days_range_past[0];
                end_date = (value.days_range_past.length == 1)? start_date : value.days_range_past[1];

                an_entry['title'] = '[Future] ' + an_entry['title'];

            } else {
                start_date = value.days_range[0]
                end_date = (value.days_range.length == 1)? start_date : value.days_range[1]
            }

            an_entry['start'] = localized_time(start_date),
            an_entry['end'] = localized_time(end_date),

            events.push(an_entry);

            count++;
        }

        // The legend
        let the_legend = []
        for ( let [key, value] of Object.entries(colors_by_elements_type)) {
            // Define the current legend entry extending base style with tunned backgroundColor (following the colors constant definition)
            const name = (key == "default")?"All":capitalize(key);
            const shortname = (key == "default")?"*":name.slice(0,3);

            the_legend.push(
                <RaisedButton
                  backgroundColor={styles.element_style[value]['backgroundColor']}
                  label={shortname}
                  title={name}
                  style={styles['calendarLegendEntry']}
                  onClick={(e) => this.updateType(name)}
                  key={"legend_button_" + shortname}
                />
            )
        }

        // Our CustomToolbar with buttons, label and legend
        const CustomToolbar = (toolbar) => {
          const goToBack = () => {
            toolbar.date.setMonth(toolbar.date.getMonth() - 1);
            toolbar.onNavigate('prev');
            this.props.update_calendar_date(toolbar.date);
          };

          const goToNext = () => {
            toolbar.date.setMonth(toolbar.date.getMonth() + 1);
            toolbar.onNavigate('next');
            this.props.update_calendar_date(toolbar.date);
          };

          const goToCurrent = () => {
            const now = new Date();
            toolbar.date.setMonth(now.getMonth());
            toolbar.date.setYear(now.getFullYear());
            toolbar.onNavigate('current');
            this.props.update_calendar_date(toolbar.date);
          };

          const goToYear = (howManyYears) => {
            const now = toolbar.date;
            const resultingYear = parseInt(now.getFullYear()) + parseInt(howManyYears)

            toolbar.date.setYear(resultingYear);
            toolbar.onNavigate('current');
            this.props.update_calendar_date(toolbar.date);
          };

          const goToPrevYear = () => {goToYear(-1)};
          const goToNextYear = () => {goToYear(+1)};

          const label = () => {
            const date = localized_time(toolbar.date);
            return (
              <span><b>{capitalize(date.format('MMMM'))} {date.format('YYYY')}</b></span>
            );
          };


          return (
            <Toolbar>
                <ToolbarGroup>
                    <div style={styles['calendarNavigation']}>
                        <FlatButton title="Previous year" className={'btn-yearAgo'} onClick={goToPrevYear} style={styles['calendarNavigationButtons']}><strong>&#8249;&#8249;</strong></FlatButton>
                        <FlatButton title="Previous month" className={'btn-back'} onClick={goToBack} style={styles['calendarNavigationButtons']}><strong>&#8249;</strong></FlatButton>
                        <FlatButton title="Go to today" className={'btn-current'} onClick={goToCurrent} style={styles['calendarNavigationButtons']}><strong>&nbsp;&nbsp;Today&nbsp;&nbsp;&nbsp;</strong></FlatButton>
                        <FlatButton title="Next month" className={'btn-next'} onClick={goToNext} style={styles['calendarNavigationButtons']}><strong>&#8250;</strong></FlatButton>
                        <FlatButton title="Next year" className={'btn-yearMore'} onClick={goToNextYear} style={styles['calendarNavigationButtons']}><strong>&#8250;&#8250;</strong></FlatButton>
                    </div>
                </ToolbarGroup>

                <ToolbarGroup>
                    <ToolbarTitle text={label()} style={styles['calendarLabel']}/>
                </ToolbarGroup>

                <ToolbarGroup>
                    <div style={styles['calendarLegend']}>
                        {the_legend}
                    </div>
                </ToolbarGroup>
            </Toolbar>
          );

          return (
              <div className="row">
                  <div className="col-md-4" style={styles['alignLeft']}>
                      <FlatButton title="Previous year" className={'btn-yearAgo'} onClick={goToPrevYear} style={styles['calendarNavigationButtons']}><strong>&#8249;&#8249;</strong></FlatButton>
                      <FlatButton title="Previous month" className={'btn-back'} onClick={goToBack} style={styles['calendarNavigationButtons']}><strong>&#8249;</strong></FlatButton>
                      <FlatButton title="Go to today" className={'btn-current'} onClick={goToCurrent} style={styles['calendarNavigationButtons']}><strong>&nbsp;&nbsp;Today&nbsp;&nbsp;&nbsp;</strong></FlatButton>
                      <FlatButton title="Next month" className={'btn-next'} onClick={goToNext} style={styles['calendarNavigationButtons']}><strong>&#8250;</strong></FlatButton>
                      <FlatButton title="Next year" className={'btn-yearMore'} onClick={goToNextYear} style={styles['calendarNavigationButtons']}><strong>&#8250;&#8250;</strong></FlatButton>
                  </div>

                  <div className="col-md-4" style={styles['alignCenter']}>
                      <h4 style={styles['calendarLabel']}>{label()}</h4>
                  </div>

                  <div className="col-md-4" style={styles['alignRight']}>
                      <div style={styles['calendarLegend']}>
                          {the_legend}
                      </div>
                  </div>
              </div>
          );
        };



        // The calendar
        const the_calendar =
            <BigCalendar
                selectable={(multiElementMode)?false:true}
                events={events}
                defaultView={this.calendar_settings.defaultView}
                defaultDate={this.todayDate}
                popup={this.calendar_settings.popup}
                views={this.calendar_settings.views}
                eventPropGetter={e => this.colorizeEvents(e)}
                onSelectEvent={
                    (multiElementMode)? (element) => this.toggleSelectElement(element.count, element.id, element.title) : (event) => dispatchNewRoute(event.url)
                }
                onSelectSlot={slotInfo => this.setRangeOfDates(slotInfo)}
                components={{
                    toolbar: CustomToolbar
                }}
            />;


        return (
            <div>
                <Dialog
                  title={this.creation_dialog['title']}
                  actions={this.creation_dialog['actions']}
                  modal={false}
                  open={this.state.creation_dialog_open}
                  onRequestClose={() => this.creation_dialog_close()}
                >
                    {this.creation_dialog['body']}
                </Dialog>

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

                <div className="row" style={styles.rowCalendar}>
                    <div ref="the_elements" className="col-md-12">
                        {the_calendar}
                    </div>
                </div>

                :

                <div className="row" style={styles.rowCalendar}>
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
