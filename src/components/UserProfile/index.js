import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../actions/data';
import { browserHistory } from 'react-router';


import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';


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

              <Card>
                <CardHeader
                  title="URL Avatar"
                  subtitle="Subtitle"
                  avatar="images/jsa-128.jpg"
                />
                <CardMedia
                  overlay={<CardTitle title="Overlay title" subtitle="Overlay subtitle" />}
                >
                  <img src="images/nature-600-337.jpg" />
                </CardMedia>
                <CardTitle title="Card title" subtitle="Card subtitle" />
                <CardText>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
                  Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
                  Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
                </CardText>
                <CardActions>
                  <FlatButton label="Action1" />
                  <FlatButton label="Action2" />
                </CardActions>
              </Card>

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
