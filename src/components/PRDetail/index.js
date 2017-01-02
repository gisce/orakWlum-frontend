import React, { Component } from 'react';

const styles = {
    wrapper: {
      display: 'flex',
      flexWrap: 'wrap',
    },
};

export class PRDetail extends Component {
    render() {
        const PR = (this.props.PR)?this.props.PR:null;

        const title = (this.props.title)?this.props.title:"Component";

        return (
            <div>
                {
                    (PR != null)?
                        <div>
                            <h2>{title} {PR.title}</h2>
                            <hr/>
                            <div dangerouslySetInnerHTML={{__html: PR.body}}/>
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
