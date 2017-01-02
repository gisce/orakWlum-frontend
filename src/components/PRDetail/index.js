import React, { Component } from 'react';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import OpenDetailIcon from 'material-ui/svg-icons/navigation/expand-more';
import CloseDetailIcon from 'material-ui/svg-icons/navigation/expand-less';
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

        const title = ((this.props.title)?this.props.title:"Component") + " " + PR.title;

        const open = this.state.open;

        const detailIcon = (open)?<CloseDetailIcon/>:<OpenDetailIcon/>;

        return (
            <div>
                {
                    (PR != null)?
                        <div >
                            <Card>
                                <CardTitle title={title}/>
                                <CardMedia
                                  overlay={<CardTitle title={title}/>}
                                >
                                </CardMedia>

                                {(open) &&
                                    <CardText>
                                        <div dangerouslySetInnerHTML={{__html: PR.body}}/>
                                    </CardText>
                                }

                                <CardActions>
                                  <FlatButton label="Detail" icon={detailIcon} onClick={(e) => this.toggleOpen(e)} />
                                  <FlatButton label="Github" icon={<DuplicateIcon/>} onClick={(e) => duplicateProposal(e, proposal.id)} />
                                </CardActions>
                            </Card>
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
