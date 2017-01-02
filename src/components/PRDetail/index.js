import React, { Component } from 'react';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import DetailIcon from 'material-ui/svg-icons/navigation/expand-more';
import DuplicateIcon from 'material-ui/svg-icons/content/content-copy';

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

        const title = (this.props.title)?this.props.title:"Component";

        return (
            <div>
                {
                    (PR != null)?
                        (this.state.open)?
                            <div onClick={(e) => this.toggleOpen(e)}>
                                <Card>
                                    <CardTitle title={title + PR.title}/>
                                    <CardText>
                                        <div dangerouslySetInnerHTML={{__html: PR.body}}/>
                                    </CardText>

                                    <CardActions>
                                      <FlatButton label="Detail" icon={<DetailIcon/>} disabled/>
                                      <FlatButton label="Github" icon={<DuplicateIcon/>} onClick={(e) => duplicateProposal(e, proposal.id)}/>
                                    </CardActions>

                                </Card>
                            </div>
                            :
                            <div title="Click me to view more detail" onClick={(e) => this.toggleOpen(e)}>
                                <h2>+ {title} {PR.title}</h2>
                                <hr/>
                            </div>
                    :
                    <div>{title} info not available</div>

                }
            </div>
        );
    }
}

PRDetail.propTypes = {
    PR: React.PropTypes.object.isRequired,
    width: React.PropTypes.number,
};
