import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {browserHistory} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {
    Card,
    CardActions,
    CardHeader,
    CardMedia,
    CardTitle,
    CardText
} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import Avatar from 'material-ui/Avatar';
import TextField from 'material-ui/TextField';
import Chip from 'material-ui/Chip';
import {
    orange300,
    orange900,
    green300,
    green900,
    red300,
    red900
} from 'material-ui/styles/colors';

import Toggle from 'material-ui/Toggle';

import * as actionCreators from '../../actions/orakwlum';

import {Tag} from '../Tag';

import {ElementGraph} from '../ElementGraph';
import {ElementTable} from '../ElementTable';
import {ElementDetail} from '../ElementDetail';
import {ElementDefinition} from '../ElementDefinition';
import {ElementTableEditable} from '../ElementTableEditable';

import {Notification} from '../Notification';
import Dialog from 'material-ui/Dialog';

//Icons
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh';
import RunIcon from 'material-ui/svg-icons/av/play-circle-outline';
import ExpandIcon from 'material-ui/svg-icons/navigation/expand-more';
import CollapseIcon from 'material-ui/svg-icons/navigation/expand-less';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import DuplicateIcon from 'material-ui/svg-icons/content/content-copy';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import ExportIcon from 'material-ui/svg-icons/file/file-download';
import ElementIcon from 'material-ui/svg-icons/image/switch-camera';
import TuneIcon from 'material-ui/svg-icons/editor/border-all';
import SaveIcon from 'material-ui/svg-icons/content/save';
import ResetIcon from 'material-ui/svg-icons/action/restore';
import ViewIcon from 'material-ui/svg-icons/action/pageview';

import {adaptProposalData} from '../../utils/graph';
import {capitalize} from '../../utils/misc';

import {localized_time, day_format, parse_day_format} from '../../constants'

const locale = 'es';
const dateOptions = {
    day: '2-digit',
    year: 'numeric',
    month: '2-digit'
};
const hourOptions = {
    day: '2-digit',
    year: 'numeric',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
};

const styles = {
    chip: {
        margin: 4
    },
    wrapper: {
        display: 'flex'
    },
    aggregationsRight: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    aggregationsCenter: {
        display: 'flex',
        justifyContent: 'center'
    },
    aggregations: {
        display: 'flex'
    },
    toggle: {
        marginTop: 7
    },
    labelToggle: {
        marginTop: 7,
        marginLeft: 7
    },
    cardSeparator: {
        marginTop: 50,
        marginBottom: 20
    },
    notes: {
        field: {
            marginLeft: 20,
        },
        creator: {
            marginTop: -30,
        }
    },
};

const colors = {
    pending: {
        hard: orange900,
        soft: orange300,
        text: 'white'
    },
    accepted: {
        hard: green900,
        soft: green300,
        text: 'white'
    },
    denied: {
        hard: red900,
        soft: red300,
        text: 'white'
    }
}

function mapStateToProps(state) {
    return {
        userName: state.auth.userName,
        isAuthenticated: state.auth.isAuthenticated,
        sources: state.orakwlum.sources,
        modifications: state.orakwlum.modifications,
        aggregations_from_state: state.orakwlum.aggregations
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export class Elementt extends Component {
    constructor(props) {
        super(props);

        this.confirmation = {
            open: false
        }

        this.id = props.proposal.id;

        this.state = {
            proposal: props.proposal,
            proposalTable: false,
            withLosses: false,
            aggregations: props.aggregations,
            aggregationSelected: props.aggregations[0].id,
            message_text: props.message_text,
            message_open: false,
            confirmation_text: null,
            confirmation_open: false
        };

        this.animateChart = true;

        this.edit_open = false;
        this.tune_open = false;
        this.detail_open = false;
        this.notes_open = false;

        props.aggregations[0].selected = true;

        if (props.comparation) {
            this.notes_open = false;
            this.edit_open = false;
            this.tune_open = false;
            this.detail_open = true;
            this.comparation = true;
        }

        // Adapted data by aggregationId
        this.data = {}
        this.average = {}
        this.components = {}

        //Initialize modifications with existant values or {}
        this.modifications = (this.id in props.modifications)
            ? props.modifications[this.id].modifications
            : {};

        //Initialize dataset
        //this.prepareData(props.proposal.prediction, props.aggregations)

        //Notes and new note initialization
        this.notes = (props.proposal.notes)? props.proposal.notes : [];
        this.new_note = {content: ""}
    }

    prepareData = (prediction, aggregations) => {
        if (prediction && Object.keys(prediction).length > 0) {

            for (let [key, an_agg]of Object.entries(aggregations)) {
                const current_agg_id = an_agg.id;

                //The Prediction of current aggregation
                const predictionAdapted = adaptProposalData(prediction['result']);
                const current = predictionAdapted[current_agg_id];

                //Initialize modifications for current aggregation just if empty
                if (!(current_agg_id in this.modifications))
                    this.modifications[current_agg_id] = {};

                const currentModifications = this.modifications[current_agg_id];

                this.data[current_agg_id] = current.result;

                //Merge the modifications
                for (let [hour_key, an_hour] of Object.entries(currentModifications)) {
                    this.data[current_agg_id][hour_key] = {
                        ...this.data[current_agg_id][hour_key],
                        ...currentModifications[hour_key]
                    }
                }

                this.average[current_agg_id] = current.average;
                this.components[current_agg_id] = current.components;
            };

            this.summary = (prediction.summary != undefined)
                ? prediction.summary
                : null;
        }
    }

    dummyAsync = (cb) => {
        this.setState({loading: true}, () => {
            this.asyncTimer = setTimeout(cb, 2000);
        });
    };

    applyTunedChanges = (updated_field, difference, total) => {
        // For each difference
        for (let [hour_position, hour_difference]of Object.entries(difference)) {

            // Apply it for all available aggregations in computed data
            for (let [agg_key, an_agg] of Object.entries(this.props.aggregations)) {
                const current_agg_id = an_agg.id;

                //Update the total for this hour
                this.data[current_agg_id][hour_position]["total"] = parseInt(this.data[current_agg_id][hour_position]["total"]) + parseInt(hour_difference)

                //Update the tuned amount just for the others aggregations
                if (current_agg_id != this.state.aggregationSelected) {
                    this.data[current_agg_id][hour_position]["tuned"] = parseInt(this.data[current_agg_id][hour_position]["tuned"]) + parseInt(hour_difference)

                    //Add the modification value to the modifications object
                    this.modifications[current_agg_id][hour_position] = {
                        ...this.modifications[current_agg_id][hour_position],
                        "tuned": this.data[current_agg_id][hour_position]["tuned"], //save modification as "tuned"
                        ["total"]: this.data[current_agg_id][hour_position]["total"], //save updated "totals"
                    }
                } else {
                    //Add the modification to the altered field
                    this.modifications[current_agg_id][hour_position] = {
                        ...this.modifications[current_agg_id][hour_position],
                        [updated_field]: parseInt(total), //save modification as updated_field
                        ["total"]: this.data[current_agg_id][hour_position]["total"], //save updated totals
                    }
                }
            }
        }
    }

    toogleElementRender = (event, status) => {
        this.setState({proposalTable: status, message_open: false});
        this.animateChart = false;
    };

    // Handle if a Element must be rendered with Losses or just measures
    toogleElementTotals = (event, status) => {
        this.setState({withLosses: status, message_open: false});
        this.animateChart = false;
    };

    changeElementAggregation = (event, agg) => {
        //initialize selection of all elements
        this.state.aggregations.map(function(agg, i) {
            agg.selected = false;
        });

        //select current
        agg.selected = true;

        //save it to change the graph
        this.setState({aggregationSelected: agg.id, message_open: false});

        this.animateChart = false;
    };

    handleOpenConfirmation = (open) => {
        this.setState({confirmation_open: true});
    };

    handleCloseConfirmation = (open) => {
        this.setState({confirmation_open: false});
    };

    refreshElementQuestion = (event, proposalID) => {
        event.preventDefault();
        this.confirmation.confirmation_open = true;

        this.animateChart = false;

        const actionsButtons = [
            <FlatButton
                label = "Cancel"
                primary = {true}
                onTouchTap = {this.handleCloseConfirmation}
            />
            ,
            <FlatButton
                label = "Submit"
                primary = {true}
                keyboardFocused = {true}
                onTouchTap = {() => this.refreshElement(proposalID)}
            />
        ];

        this.confirmation.title = "Refresh current proposal";

        this.confirmation.text =
            <div>
                <p>The Element will be refreshed fetching the last changes at DB. Unsaved changes will be discarted.</p>
                <p>Are you sure about to
                <b>refresh this Element</b>?</p>
            </div>;

        this.confirmation.actionsButtons = actionsButtons;

        this.setState({message_open: false, confirmation_open: true});
    };

    refreshElement = (proposalID) => {
        this.setState({confirmation_open: false});
        this.animateChart = false;

        this.props.fetchElementsDetail(proposalID);

        this.setState({message_open: true});

        this.animateChart = true;
    };

    reRunElementQuestion = (event, proposalID) => {
        event.preventDefault();
        this.confirmation.confirmation_open = true;

        const actionsButtons = [
            <FlatButton
                label = "Cancel"
                primary = {true}
                onTouchTap = {this.handleCloseConfirmation}
            />
            ,
            <FlatButton
                label = "Submit"
                primary = {true}
                keyboardFocused = {true}
                onTouchTap = {() => this.reRunElement(proposalID)}
            />
        ];

        this.confirmation.title = "Reprocess current Element";
        this.confirmation.text =
            <div>
                <p>The Element will be reprocessed using the last data on DB. It can take a few seconds...</p>
                <p>Are you sure about to
                <b>reprocess this Element</b>?</p>
            </div>;

        this.confirmation.actionsButtons = actionsButtons;

        this.setState({message_open: false, confirmation_open: true});

        this.animateChart = false;
    };

    reRunElement = (proposalID) => {
        this.animateChart = false;
        this.setState({message_open: true, confirmation_open: false});

        this.props.runElement(proposalID);

        this.dummyAsync(() => this.animateChart = true);

        this.animateChart = true;

    };

    toggleDetail = () => {
        this.detail_open = !this.detail_open;
        this.animateChart = false;
        this.edit_open = false;

        this.setState({detail_open: this.detail_open});
    };

    toggleNotes = () => {
        this.notes_open = !this.notes_open;
        this.animateChart = false;
        this.edit_open = false;

        this.setState({notes_open: this.notes_open});
    };

    toggleEdit = () => {
        this.edit_open = !this.edit_open;
        this.tune_open = false;

        this.animateChart = false;

        this.setState({edit_open: this.edit_open});
    };


    saveTuned = () => {
        this.props.saveTunedValues(this.id, this.modifications)
    };

    toggleTune = () => {
        this.tune_open = !this.tune_open;
        this.edit_open = false;

        this.animateChart = false;

        this.setState({tune_open: this.tune_open});
    };

    resetModifications = () => {
        //Free modifications
        this.modifications = {}

        //Prepare data structures with empty modifications
        this.prepareData(this.state.proposal.prediction, this.state.aggregations)

        //Re-render!
        this.setState({})
    };

    duplicateElementQuestion = (event, proposalID) => {
        event.preventDefault();
        this.confirmation.confirmation_open = true;

        const actionsButtons = [ <FlatButton label = "Cancel" primary = {
                true
            }
            onTouchTap = {
                this.handleCloseConfirmation
            } />, <FlatButton label = "Submit" primary = {
                true
            }
            keyboardFocused = {
                true
            }
            onTouchTap = {
                () => this.duplicateElement(proposalID)
            } />
        ];

        this.confirmation.title = "Duplicate current Element";
        this.confirmation.text = <div>
            <p>The Element will be duplicated. The consumptions will not be reprocessed, if needed "Run" the new Element once it's cloned.</p>
            <p>Are you sure about to
                <b>duplicate this Element</b>?</p>
        </div>;
        this.confirmation.actionsButtons = actionsButtons;

        this.animateChart = false;
        this.setState({message_open: false, confirmation_open: true});
    };

    duplicateElement = (proposalID) => {
        this.animateChart = false;
        this.setState({message_open: true, confirmation_open: false});
        this.props.duplicateElement(proposalID);
    };

    deleteElementQuestion = (event, proposalID) => {
        event.preventDefault();
        this.confirmation.confirmation_open = true;

        const actionsButtons = [
            <FlatButton
                label = "Cancel"
                primary = {true}
                onTouchTap = {this.handleCloseConfirmation}
            />
            ,
            <FlatButton label = "Submit"
                primary = {true}
                keyboardFocused = {true}
                onTouchTap = {() => this.deleteElement(proposalID)}
            />
        ];

        this.confirmation.title = "Delete current Element";
        this.confirmation.text = <div>
            <p>The Element will be deleted. This process can't be undone...</p>
            <p>Are you sure about to
                <b>delete this Element</b>?</p>
        </div>;
        this.confirmation.actionsButtons = actionsButtons;

        this.animateChart = false;
        this.setState({message_open: false, confirmation_open: true});
    };

    deleteElement = (proposalID) => {
        this.animateChart = false;
        this.setState({message_open: true, confirmation_open: false});
        const token = this.props.token;
        this.props.deleteElement(token, proposalID);
    };

    exportElement = (event, proposalID) => {
        event.preventDefault();

        this.setState({animateChart: false, message_text: "Exporting current proposal", confirmation_open: false});

        this.props.exportElement(proposalID);
    };

    handleConfirmation = (what, message, text) => {
        this.next = what;
        this.message = message
        this.text = text
        this.open_confirmation = true;
    }

    addNewNote = () => {
        this.new_note.author = "Xavi"
        this.new_note.creation_date = localized_time().unix()

        //Create a new tmp note element with a new memspace
        const the_new_note = Object.assign({}, this.new_note);
        console.debug("Adding new note", the_new_note);

        this.notes = [the_new_note, ...this.notes];

        this.props.updateElement({id: this.id, notes: this.notes})    }

    updateNewNote = (event) => {
        this.new_note.content = event.target.value;
    }

    render() {
        const readOnly = (this.props.readOnly)
            ? this.props.readOnly
            : false;

        const proposal = this.props.proposal;
        this.prepareData(this.props.proposal.prediction, this.props.aggregations)


        const {notes} = proposal;

        const proposalTable = this.state.proposalTable;
        const withLosses = this.state.withLosses;

        const historical = (proposal.historical == false)
            ? false
            : true;

        const days = [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday'
        ];

        const lastExecution = new Date(proposal.execution_date * 1000).toLocaleString(locale, hourOptions);
        const creationDate = new Date(proposal.creation_date * 1000).toLocaleString(locale, hourOptions);
        const updateDate = new Date(proposal.update_date * 1000).toLocaleString(locale, hourOptions);

        const ownerText = (proposal.owner)
            ? "by " + proposal.owner
            : "";

        const withPicture = (proposal.isNew)
            ? !proposal.isNew
            : true;

        const element_type = (proposal.element_type)
            ? proposal.element_type
            : "Unknown";

        //Define the start and end dates
        const start_date = (proposal.days_range.length > 0)
            ? localized_time(proposal.days_range[0], parse_day_format)
            : null;

        const end_date = (proposal.days_range.length > 1)
            ? localized_time(proposal.days_range[0], parse_day_format)
            : start_date;

        const start_date_past = (!historical)
            ? localized_time(proposal.days_range_past[0], parse_day_format)
            : null;

        const end_date_past = (!historical)
            ? ((proposal.days_range_past.length > 1)
                ? localized_time(proposal.days_range_past[0], parse_day_format)
                : start_date_past)
            : null;

        /// Process Element dates
        const proposalDaysRange = (proposal.days_range)
            ? proposal.days_range
            : [];
        const proposalDaysRangePast = (proposal.days_range_past)
            ? proposal.days_range_past
            : proposalDaysRange;

        const daysRangeString = (proposalDaysRange.length == 1)
            ? "" + start_date.format(day_format)
            : "" + start_date.format(day_format) + " - " + end_date.format(day_format);

        const daysRangeStringPastString = (!historical)
            ? ((proposalDaysRangePast.length == 1)
                ? "" + start_date_past.format(day_format)
                : "" + start_date_past.format(day_format) + " - " + end_date_past.format(day_format))
            : "";

        const dayOfElement = start_date.toDate().getDay();

        const dayOfElementPast = (historical)
            ? null
            : start_date_past.toDate().getDay();

        const title_type = (element_type == "concatenation" || element_type == "comparation")
            ? ""
            : capitalize(element_type);

        const title = <span>{title_type} {proposal.name}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[{daysRangeString}]</span>

        const subtitle = <span>Using {days[dayOfElement]}
            {daysRangeStringPastString}</span>;

        const offset = (withPicture)
            ? 0
            : 1;

        const size = (withPicture)
            ? 8
            : 9;

        const prediction = proposal.prediction;

        const aggregationSelected = this.state.aggregationSelected;
        const changeElementAggregation = this.changeElementAggregation;
        const aggregations = this.state.aggregations;

        const refreshElement = this.refreshElementQuestion;
        const reRunElement = this.reRunElementQuestion;
        const duplicateElement = this.duplicateElementQuestion;
        const deleteElement = this.deleteElementQuestion;
        const exportElement = this.exportElement;

        const {
            detail_open,
            notes_open,
            edit_open,
            tune_open,
            toggleDetail,
            toggleEdit,
            toggleTune,
            toggleNotes,
        } = this;

        const DetailIcon = (detail_open == true)
            ? CollapseIcon
            : ExpandIcon;

        const NotesIcon = (notes_open == true)
            ? CollapseIcon
            : ExpandIcon;

        const actionsButtons = [ <FlatButton label = "Cancel" primary = {
                true
            }
            onTouchTap = {
                this.handleCloseConfirmation
            } />, <FlatButton label = "Submit" primary = {
                true
            }
            keyboardFocused = {
                true
            }
            onTouchTap = {
                this.handleCloseConfirmation
            } />
        ];

        // The Element status!
        const proposalStatus = (proposal.status && <div className={"col-md-2 col-lg-2"} style={styles.wrapper}>
            <Tag tag={proposal.status}/>
        </div>)

        // The Element Aggregations List
        const aggregationsStyle = (withPicture)
            ? styles.aggregations
            : styles.aggregationsRight;

        const proposalAggregations = (aggregations && <div id="aggregationsList" className={"col-md-offset-" + (offset) + " col-md-" + size + " col-lg-offset-" + (offset) + " col-lg-" + size} style={aggregationsStyle}>
            {aggregations.map(function(agg, i) {
                return (
                    <div key={"aggregationDivTag_" + i} onClick={(e) => changeElementAggregation(e, agg)}>
                        <Tag key={"aggregationTag_" + i} tag={agg.lite} selected={agg.selected} readOnly/>
                    </div>
                );
            })
}
        </div>)

        // The Element graph toogle! //to switch between table and chart
        const proposalPictureToggle = ((withPicture) && (!this.comparation) && <div className="col-xs-offset-0 col-xs-6 col-sm-offset-0 col-sm-3 col-md-2 col-md-offset-0 col-lg-offset-0 col-lg-2" style={styles.to_ri}>
            {(proposalTable)
                ? <div id="togglePicture" className="row" style={styles.aggregationsCenter}>
                        <div className="col-xs-2" style={styles.labelToggle}>
                            Chart
                        </div>
                        <div id="toogleElement" className="col-xs-3">
                            <Toggle onToggle={this.toogleElementRender} style={styles.toggle} toggled={proposalTable}/>
                        </div>
                        <div className="col-xs-2" style={styles.toggle}>
                            <b>Table</b>
                        </div>
                    </div>
                : <div id="togglePicture" className="row" style={styles.aggregationsCenter}>
                    <div className="col-xs-2" style={styles.labelToggle}>
                        <b>Chart</b>
                    </div>
                    <div id="toogleElement" className="col-xs-3">
                        <Toggle onToggle={this.toogleElementRender} style={styles.toggle} toggled={proposalTable}/>
                    </div>
                    <div className="col-xs-2" style={styles.toggle}>
                        Table
                    </div>
                </div>
}
        </div>)

        const LossesHelp = "Render an Element with their related losses or just their measures"

        // The Element graph toogle! //to switch between table and chart
        const withLossesToggle = <div className="col-xs-offset-0 col-xs-6 col-sm-offset-0 col-sm-3 col-md-2 col-md-offset-0 col-lg-offset-0 col-lg-2" style={styles.to_ri}>
            {(withLosses)
                ? <div id="togglePicture" className="row" style={styles.aggregationsCenter}>
                        <div className="col-xs-2" style={styles.labelToggle}>
                            Measures
                        </div>
                        <div id="toogleElement" className="col-xs-3">
                            <Toggle onToggle={this.toogleElementTotals} style={styles.toggle} toggled={withLosses} title={LossesHelp}/>
                        </div>
                        <div className="col-xs-2" style={styles.toggle}>
                            <b>Totals</b>
                        </div>
                    </div>
                : <div id="togglePicture" className="row" style={styles.aggregationsCenter}>
                    <div className="col-xs-2" style={styles.labelToggle}>
                        <b>Measures</b>
                    </div>
                    <div id="toogleElement" className="col-xs-3">
                        <Toggle onToggle={this.toogleElementTotals} style={styles.toggle} toggled={withLosses} title={LossesHelp}/>
                    </div>
                    <div className="col-xs-2" style={styles.toggle}>
                        Totals
                    </div>
                </div>
}
        </div>

        const adaptedElement = Object.assign({}, proposal, {
            start_date: start_date.toDate(),
            end_date: end_date.toDate()
        })

        /*
    SmartTable adaption!
        const proposalTuneHeaders = Object.keys(components).map(function( component, index){
            return {
                title: component,
                width: null,
            }
        });

        const proposalTuneData = Object.keys(data).map(function( hour, index){
            return Object.keys(components).map(function( component, indexComp){
                  return data[hour][component];
            });
        });
  */

        let proposalPicture;

        // Handle EDIT
        if (edit_open) {
            const proposalEdit = <div>
                <ElementDefinition
                    aggregationsList={this.props.aggregations}
                    sourcesList={this.props.sources.measures}
                    defaultValue={adaptedElement}
                    editMode={true}
                    endingParentMethod={() => this.toggleEdit()}
                />
            </div>;

            proposalPicture =// Handle TUNE
            proposalEdit;
        } else if (tune_open) {
            const the_components = this.components;

            const proposalTuneHeaders = Object.keys(the_components[aggregationSelected]).map(function(component, index) {

                if (component == "tuned")
                    return {
                        key: component,
                        name: the_components[aggregationSelected][component].title,
                        editable: true,
                        resizable: true,
                        editable: false,
                    }
                else
                    return {
                        key: component,
                        name: the_components[aggregationSelected][component].title,
                        editable: true,
                        resizable: true,
                    }
            });

            const hour_column = {
                key: 'day_string',
                name: 'Hour',
                editable: false,
                width: 75,
                resizable: true,
                sortable: false
            };

            const proposalTune = <div>
                <FlatButton label="View" icon={<ViewIcon />} onClick={this.toggleTune} title={"See current modifications"}/>
                <FlatButton label="Reset" icon={<ResetIcon />} onClick={this.resetModifications} title={"Reset modifications to initial state"}/>

                <ElementTableEditable
                    header={[
                        hour_column,
                        ...proposalTuneHeaders
                        ]}
                    data={this.data[aggregationSelected]}
                    parentDataHandler={(changes, difference, total) => this.applyTunedChanges(changes, difference, total)}
                />
            </div>;

            proposalPicture = proposalTune;

            // Handle PICTURE
        } else {
            if (withPicture && prediction && Object.keys(prediction).length > 0)
                proposalPicture = (proposalTable)
                    ? <ElementTable stacked={true} data={this.data[aggregationSelected]} components={this.components[aggregationSelected]} height={500} unit={"kWh"}/>
                    : <ElementGraph stacked={true} data={this.data[aggregationSelected]} components={this.components[aggregationSelected]} height={500} animated={this.animateChart} unit={"kWh"}/>
        }

        const disableDetail = (element_type == "concatenation")
            ? true
            : false;
        const disableExport = (element_type == "comparation")
            ? true
            : false;

        const proposalActions = (!readOnly && !this.comparation)
            ? <CardActions>
                <FlatButton label="Refresh" icon={<RefreshIcon />} onClick={(e) => refreshElement(e, proposal.id)} title={"Refresh current proposal"}/>
                <FlatButton label="Process" icon={<RunIcon />} onClick={(e) => reRunElement(e, proposal.id)} title={"Reprocess current proposal"}/>
                <FlatButton label="Detail" icon={<DetailIcon />} onClick={(e) => toggleDetail(e)} title={"Toggle detailed view"} disabled={disableDetail}/>
                <FlatButton label="Notes" icon={<NotesIcon />} onClick={(e) => toggleNotes(e)} title={"Toggle notes view"}/>
                <FlatButton label="Edit" icon={<EditIcon />} onClick={(e) => toggleEdit(e)} title={"Toggle edit view"}/>
                <FlatButton label="Tune" icon={<TuneIcon />} onClick={(e) => toggleTune(e)} title={"Toggle tune view"}/>
                <FlatButton label="Save" icon={<SaveIcon />} onClick={(e) => this.saveTuned(e)} title={"Apply tunned changes!"}/>
                <FlatButton label="Export" icon={<ExportIcon />} onClick={(e) => exportElement(e, proposal.id)} title={"Export Element to a XLS file"} disabled={disableExport}/>
                <FlatButton label="Duplicate" icon={<DuplicateIcon />} onClick={(e) => duplicateElement(e, proposal.id)} title={"Duplicate current proposal to a new one"}/>
                <FlatButton label="Delete" icon={<DeleteIcon />} onClick={(e) => deleteElement(e, proposal.id)} title={"Delete current proposal"}/>

                {(proposal.related_id)
                    ? <FlatButton label="Historical" icon={<ElementIcon />} href={"/historicals/" + proposal.related_id} title={"Switch to related historical"}/>
                    : <FlatButton disabled label="Historical" title={"Switch to related historical"}/>
                }
                </CardActions>
            : null;

        const proposalDetail = (this.summary != null) && (detail_open == true) &&
            <div>
                {proposalActions}
                <div style={styles.cardSeparator}>
                    <ElementDetail
                        data={this.summary}
                        avg_info={{
                            'average': this.average[aggregationSelected],
                            'data': this.data[aggregationSelected],
                            'components': this.components[aggregationSelected]
                        }}
                    />
                </div>
            </div>;




        let the_notes = [];

        //The Add note form
        the_notes.push(
            <div key={"card_creator_div"}>
                <Card key={"card_creator"}>
                    <CardHeader
                      title={"Create a new note"}
                      showExpandableButton={true}
                    />

                    <CardText expandable={true}>
                        <TextField
                            style={styles.notes.creator}
                            hintText="Insert your message..."
                            floatingLabelText="Message"
                            multiLine={true}
                            rows={5}
                            fullWidth={true}
                            onChange={this.updateNewNote}
                        />
                    </CardText>

                    <CardActions
                        style={styles.notes.creator}
                        expandable={true}
                    >

                      <FlatButton label="Add" title={"Add new note"} onClick={(e) => this.addNewNote()}/>
                    </CardActions>
                </Card>
            </div>
        )

        if (true || notes != null) {
            for (let [key, a_note]of Object.entries(this.notes)) {

                const note_date = localized_time(a_note.creation_date * 1000).format("L LT")

                the_notes.push(
                    <div key={"card_div_" + key}>
                        <Card key={"card_" + key}>
                            <CardHeader
                              title={a_note.author}
                              subtitle={note_date}
                              avatar="https://upload.wikimedia.org/wikipedia/commons/6/67/User_Avatar.png"
                              showExpandableButton={true}
                            />

                            <CardText>
                                {a_note.content}
                            </CardText>

                            <CardActions expandable={true}>
                              <FlatButton label="Mark as readed" />
                              <FlatButton label="Delete" />
                            </CardActions>
                        </Card>
                    </div>
                )
            };
        }

        const proposalNotes = (notes_open == true) &&
            <div>
                {proposalActions}
                <div>
                    {the_notes}
                </div>
            </div>

        // The resulting Element element
        const Element = () => (
            <Card>
                <CardTitle title={title} subtitle={subtitle}/>

                <CardMedia
                    overlay={
                        <CardTitle
                            title = {title}
                            subtitle = {subtitle}
                        />
                    }
                >
                </CardMedia>

                <div className="row">
                    {proposalStatus}

                    {proposalAggregations}

                    {proposalPictureToggle}
                    {withLossesToggle}
                </div>

                <CardText>
                    {proposal.creation_date && <p>
                        <span>Element was created on {creationDate}
                            {ownerText}</span>
                    </p>
}
                    {proposal.execution_date && <p>
                        <span>Last execution was performed at {lastExecution}</span>
                    </p>
}
                    {proposal.update_date && <p>
                        <span>Last update was applied at {updateDate}</span>
                    </p>
}
                </CardText>

                <br/> {proposalPicture}

                <br/> {proposalDetail}

                <br/> {proposalNotes}

                {proposalActions}

            </Card>
        );

        return (
            <div>
                <Dialog
                    open={this.state.confirmation_open}
                    title={this.confirmation.title}
                    actions={this.confirmation.actionsButtons}
                    modal={false}
                    onRequestClose={this.handleCloseConfirmation}
                >
                    {this.confirmation.text}
                </Dialog>

                <Notification
                    message={this.props.message_text}
                    open={this.state.message_open}
                />

                <Element/>
            </div>
        );
    }
}

Elementt.propTypes = {
    readOnly: PropTypes.bool,
    proposalOld: PropTypes.bool,
    comparation: PropTypes.bool
};
