import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../actions/data';

function mapStateToProps(state) {
    return {
        path: state.routing.locationBeforeTransitions.pathname,
    };
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Breadcrumb extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            path_list: props.path.split("/"),
        };

    }

    componentDidMount() {
        this.setState({
            //path_list: this.props.path.split("/"),
            path_list: "/proposals/new/quaranta_cinc_10".split("/"),
        });

        console.log(this.state.path_list);
    }

    fetchData() {
        const token = this.props.token;
        this.props.fetchProtectedDataProposals(token);
    }

    render() {
        const breadcrumbLen = this.state.path_list.length;

        let sectionUrl="";
        let classActive="";

        const sections = (
            this.state.path_list.map((section, index) => {
                if ( index === 0 ) return null;

                classActive="";
                sectionUrl += "/" + section;

                if (breadcrumbLen === index + 1) {
                    classActive="active";
                    sectionUrl=null;
                }

                return <li key={index} className={classActive}><a className={classActive} href={sectionUrl}>{section}</a></li>
            }
        ));

        return (
            <div>
                <ul className="breadcrumb">

                    {
                        this.state.path_list.map((section, index) => {
                            if ( index === 0 ) return null;

                            classActive="";
                            sectionUrl += "/" + section;

                            if (breadcrumbLen === index + 1) {
                                classActive="active";
                                sectionUrl=null;
                            }

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
