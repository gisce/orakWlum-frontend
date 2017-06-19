import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { dispatchNewRoute} from '../../utils/http_functions';

function mapStateToProps(state) {
    return {
    };
}

export default class Breadcrumb extends React.Component {
    dispatchRoute(event, route) {
        dispatchNewRoute(route, event);
        this.setState({
            open: false,
        });

    }

    render() {

        let sectionUrlold="";
        let sectionUrl=[];
        let classActive="";

        const path_list = this.props.path.split("/");
        const breadcrumbLen = path_list.length;

        path_list[0]="";

        return (
            <div>
                <ul className="breadcrumb">
                    {
                        path_list.map((section, index) => {
                            if ( index != 0 ) {

                                classActive="";

                                sectionUrlold += "/" + section;
                                sectionUrl[index] = sectionUrlold;

                                if (breadcrumbLen === index + 1) {
                                    classActive="active";
                                }

                                section = section[0].toUpperCase() + section.slice(1);
                                return <li
                                            onClick={(event) => this.dispatchRoute(event, sectionUrl[index])}
                                            key={index}
                                            className={classActive}
                                        >
                                            <a className={classActive}>{section}</a>
                                        </li>
                            }
                        })
                    }
                </ul>
            </div>
        );
    }
}

Breadcrumb.propTypes = {
    path: PropTypes.string,
};
