import React, { Component } from 'react';

const styles = {
    wrapper: {
      display: 'flex',
      flexWrap: 'wrap',
    },
};

export class PRDetail extends Component {
    constructor(props) {
        super(props);

        const open_value = (props.open)?props.open:false;
        this.state = {
            message: props.message,
            open: open_value,
        };
    }

    openDetail = () => {
        this.setState({
            message_open: true,
        });
    };

    closeDetail = () => {
        this.setState({
            message_open: false,
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
                            <div>
                                <h2>{title} {PR.title}</h2>
                                <hr/>
                                <div dangerouslySetInnerHTML={{__html: PR.body}}/>
                            </div>
                            :
                            <div>
                                <h2>{title} {PR.title}</h2>
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
