import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../actions/data';
import { browserHistory } from 'react-router';

function mapStateToProps(state) {
    return {
    };
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Breadcrumb extends React.Component {
    dispatchNewRoute(route) {
        browserHistory.push(route);
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
                                            onClick={() => this.dispatchNewRoute(sectionUrl[index])}
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
    path: React.PropTypes.string,
};
