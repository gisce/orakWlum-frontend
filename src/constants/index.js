import moment from 'moment';
import {debug} from './debug';
import {version, version_pr} from './version';

export const DEBUG = (debug)?debug:false;

export const VERSION = version;
export const VERSION_PR = version_pr;

export const API_SPECIFICATION = 1;
export const API_PREFIX = "/api/v" + API_SPECIFICATION;

export const FETCH_VERSION_REQUEST = 'FETCH_VERSION_REQUEST';
export const RECEIVE_VERSION = 'RECEIVE_VERSION';
export const RECEIVE_VERSION_ERROR = 'RECEIVE_VERSION_ERROR';

export const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS';
export const LOGIN_USER_FAILURE = 'LOGIN_USER_FAILURE';
export const LOGIN_USER_REQUEST = 'LOGIN_USER_REQUEST';
export const LOGOUT_USER = 'LOGOUT_USER';

export const REGISTER_USER_SUCCESS = 'REGISTER_USER_SUCCESS';
export const REGISTER_USER_FAILURE = 'REGISTER_USER_FAILURE';
export const REGISTER_USER_REQUEST = 'REGISTER_USER_REQUEST';

export const FETCH_PROTECTED_DATA_REQUEST = 'FETCH_PROTECTED_DATA_REQUEST';
export const RECEIVE_PROTECTED_DATA = 'RECEIVE_PROTECTED_DATA';

export const RECOVER_USER_REQUEST = 'RECOVER_USER_REQUEST';
export const RECOVER_USER_SUCCESS = 'RECOVER_USER_SUCCESS';
export const RECOVER_USER_FAILURE = 'RECOVER_USER_FAILURE';

export const CHANGE_PASSWORD_REQUEST = 'CHANGE_PASSWORD_REQUEST';
export const CHANGE_PASSWORD_OK = 'CHANGE_PASSWORD_OK';
export const CHANGE_PASSWORD_KO = 'CHANGE_PASSWORD_KO';
export const CHANGE_PASSWORD_INI = 'CHANGE_PASSWORD_INI';

export const FETCH_PROPOSALS_REQUEST = 'FETCH_PROPOSALS_REQUEST';
export const RECEIVE_PROPOSALS = 'RECEIVE_PROPOSALS';
export const FETCH_PROPOSAL_REQUEST = 'FETCH_PROPOSAL_REQUEST';
export const RECEIVE_PROPOSAL = 'RECEIVE_PROPOSAL';
export const RUN_PROPOSAL_REQUEST = 'RUN_PROPOSAL_REQUEST';
export const RECEIVE_RUN_PROPOSAL = 'RECEIVE_RUN_PROPOSAL';
export const RECEIVE_RUN_PROPOSAL_ERROR = 'RECEIVE_RUN_PROPOSAL_ERROR';
export const DUPLICATE_PROPOSAL_REQUEST = 'DUPLICATE_PROPOSAL_REQUEST';
export const DELETE_PROPOSAL_REQUEST = 'DELETE_PROPOSAL_REQUEST';
export const CREATE_PROPOSAL_REQUEST = 'CREATE_PROPOSAL_REQUEST';
export const EXPORT_PROPOSAL_REQUEST = 'EXPORT_PROPOSAL_REQUEST';

export const FETCH_ELEMENTS_REQUEST = 'FETCH_ELEMENTS_REQUEST';
export const RECEIVE_ELEMENTS = 'RECEIVE_ELEMENTS';
export const OVERRIDE_ELEMENTS = 'OVERRIDE_ELEMENTS';
export const RUN_ELEMENT_REQUEST = 'RUN_ELEMENT_REQUEST';
export const RECEIVE_ELEMENTS_VOLATILE = 'RECEIVE_ELEMENTS_VOLATILE';

export const FETCH_EXPORT_ELEMENTS_REQUEST = 'FETCH_EXPORT_ELEMENTS_REQUEST';
export const FETCH_COMPARATION_ELEMENTS_REQUEST = 'FETCH_COMPARATION_ELEMENTS_REQUEST';

export const OVERRIDE_MESSAGE = 'OVERRIDE_MESSAGE';

export const FETCH_AGGREGATIONS_REQUEST = 'FETCH_AGGREGATIONS_REQUEST';
export const RECEIVE_AGGREGATIONS = 'RECEIVE_AGGREGATIONS';
export const OVERRIDE_AGGREGATIONS = 'OVERRIDE_AGGREGATIONS';



export const FETCH_HISTORICALS_REQUEST = 'FETCH_HISTORICALS_REQUEST';
export const RECEIVE_HISTORICALS = 'RECEIVE_HISTORICALS';
export const FETCH_HISTORICAL_REQUEST = 'FETCH_HISTORICAL_REQUEST';
export const RECEIVE_HISTORICAL = 'RECEIVE_HISTORICAL';
export const RUN_HISTORICAL_REQUEST = 'RUN_HISTORICAL_REQUEST';
export const RECEIVE_RUN_HISTORICAL = 'RECEIVE_RUN_HISTORICAL';
export const RECEIVE_RUN_HISTORICAL_ERROR = 'RECEIVE_RUN_HISTORICAL_ERROR';
export const DUPLICATE_HISTORICAL_REQUEST = 'DUPLICATE_HISTORICAL_REQUEST';
export const DELETE_HISTORICAL_REQUEST = 'DELETE_HISTORICAL_REQUEST';
export const CREATE_HISTORICAL_REQUEST = 'CREATE_HISTORICAL_REQUEST';
export const EXPORT_HISTORICAL_REQUEST = 'EXPORT_HISTORICAL_REQUEST';



export const FETCH_PROFILE_REQUEST = 'FETCH_PROFILE_REQUEST';
export const RECEIVE_PROFILE = 'RECEIVE_PROFILE';
export const RECEIVE_PROFILE_KO = 'RECEIVE_PROFILE_KO';

export const UPDATE_PROFILE_REQUEST = 'UPDATE_PROFILE_REQUEST';
export const UPDATE_PROFILE_OK = 'UPDATE_PROFILE_OK';
export const UPDATE_PROFILE_KO = 'UPDATE_PROFILE_KO';


export const FETCH_SETTINGS_REQUEST = 'FETCH_SETTINGS_REQUEST';
export const RECEIVE_SETTINGS = 'RECEIVE_SETTINGS';
export const RECEIVE_SETTINGS_KO = 'RECEIVE_SETTINGS_KO';

export const UPDATE_SETTINGS_REQUEST = 'UPDATE_SETTINGS_REQUEST';
export const UPDATE_SETTINGS_OK = 'UPDATE_SETTINGS_OK';
export const UPDATE_SETTINGS_KO = 'UPDATE_SETTINGS_KO';


export const APP_REMOVE_NODE = 'APP_REMOVE_NODE';
export const APP_TOGGLE_NAME = 'APP_TOGGLE_NAME';
export const APP_UPDATE_PATHS = 'APP_UPDATE_PATHS';
export const APP_CHANGE_OFFSET = 'APP_CHANGE_OFFSET';

export const NEW_NOTIFICATION = 'NEW_NOTIFICATION';
export const NOTIFICATION_DONE = 'NOTIFICATION_DONE';


/* locale definition */
const locale_override_conf = {
    week: {
        dow: 1,
    },
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd D MMMM YYYY HH:mm'
    },
}
moment.locale('en', locale_override_conf);
export const localized_time = moment;


/* Colors definition */

import { orange500, orange900, green500, green900, red500, yellow500, red900, blue500, blue900 } from 'material-ui/styles/colors'

export const colors_by_elements_type = {
    "proposal": "orange",
    "historical": "blue",
    "concatenation": "red",
    "comparation": "yellow",
    "default": "default",
};

export const colors_combo = {
    'green': { backgroundColor: green500, borderColor: '#777' },
    'blue': { backgroundColor: blue500, borderColor: '#777' },
    'red': { backgroundColor: red500, borderColor: '#777' },
    'yellow': { backgroundColor: yellow500, borderColor: '#777', color: 'black' },
    'orange': { backgroundColor: orange500, borderColor: '#777' },
    'default': { backgroundColor: green500, borderColor: '#777' },
};


export const colors = [
    '#db4939',
    '#f29913',
    '#3c8cba',
    '#00a658',
    '#C0D849',
    '#32742C',
    '#B63D70',
    '#000000',
    '#8B9294',
    '#3F36DB',
    '#3AB131',
    '#FDFF3A',
    '#F2E9E1',
    '#D5A7CC',
    '#EB9F9F',
    '#A75899',
    '#5A1A74',
    '#2C355E',
    '#A79C8E',
    '#4C9180',
    '#6B5344',
    '#ffffff',
    '#113F8C',
    '#01A4A4',
    '#00A1CB',
    '#61AE24',
    '#D0D102',
    '#D70060',
    '#E54028',
    '#F18D05',
    '#616161',
    '#A7DBD8',
    '#E0E4CC',
    '#F38630',
    '#D95B43',
    '#542437',
    '#53777A',
    '#559F60',
];
