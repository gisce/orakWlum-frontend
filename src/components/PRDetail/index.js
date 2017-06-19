import React, { Component } from 'react';

import PropTypes from 'prop-types';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import OpenDetailIcon from 'material-ui/svg-icons/navigation/expand-more';
import CloseDetailIcon from 'material-ui/svg-icons/navigation/expand-less';
import LinkIcon from 'material-ui/svg-icons/content/link';

const styles = {
    wrapper: {
      display: 'flex',
      flexWrap: 'wrap',
    },
};

export class PRDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: (props.open)?props.open:false,
        };
    }

    toggleOpen = (e) => {
        e.preventDefault();

        this.setState({
            open: !this.state.open,
        });
    };



    render() {
        const PR = (this.props.PR)?this.props.PR:null;

        const api_specification = (PR.api_specification)?"API SPEC: v" + PR.api_specification:null;

        const title = ((this.props.title)?this.props.title:"Component") + " " + PR.title;

        const open = this.state.open;

        const detailIcon = (open)?<CloseDetailIcon/>:<OpenDetailIcon/>;

        return (
            <div>
                {
                    (PR != null)?
                        <div >
                            <Card>
                                <CardTitle title={title} subtitle={api_specification}/>
                                <CardMedia
                                  overlay={<CardTitle title={title} subtitle={api_specification}/>}
                                >
                                </CardMedia>

                                <CardText>
                                    <p>Created by {PR.author} at {PR.created}</p>

                                    { (PR.merged != null) &&
                                        <p>Merged at {PR.merged}</p>
                                    }
                                </CardText>


                                {(open) &&
                                    <CardText>
                                        <div dangerouslySetInnerHTML={{__html: PR.body}}/>
                                    </CardText>
                                }

                                <CardActions>
                                  <FlatButton label="Detail" icon={detailIcon} onClick={(e) => this.toggleOpen(e)} />
                                  <a target="_blank" href={PR.url}><FlatButton label="Github" icon={<LinkIcon/>} /></a>
                                </CardActions>
                            </Card>
                        </div>

                    :
                    <div>That's embracing, but {title} info not available...</div>
                }
            </div>
        );
    }
}

PRDetail.propTypes = {
    PR: PropTypes.object.isRequired,
    open: PropTypes.bool,
};
