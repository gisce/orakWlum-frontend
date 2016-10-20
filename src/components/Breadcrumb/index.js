import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../actions/data';

function mapStateToProps(state) {
    return {
    };
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Breadcrumb extends React.Component {

    render() {

        let sectionUrl="";
        let classActive="";

        const path_list = this.props.path.split("/");
        const breadcrumbLen = path_list.length;

        return (
            <div>
                <ul className="breadcrumb">
                    {
                        path_list.map((section, index) => {
                            if ( index === 0 ) return null;

                            classActive="";
                            sectionUrl += "/" + section;

                            if (breadcrumbLen === index + 1) {
                                classActive="active";
                                sectionUrl="#";
                            }
                            section = section[0].toUpperCase() + section.slice(1);
                            return <li key={index} className={classActive}><a className={classActive} href={sectionUrl}>{section}</a></li>
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
