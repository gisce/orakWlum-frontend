import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actionCreators from '../actions/data';

import { ProposalsList } from './ProposalsList';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';


function mapStateToProps(state) {
    return {
        data: state.data,
        token: state.auth.token,
        loaded: state.data.loaded,
        isFetching: state.data.isFetching,
    };
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export default class ProposalView extends React.Component {
    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        const token = this.props.token;
        const proposal_id = this.props.params.proposalId;
        this.props.fetchProtectedDataProposal(token, proposal_id);
    }

    render() {
        const proposalId = this.props.params.proposalId;
        const proposal = this.props.data.data;

        return (
            <div>
                {!this.props.loaded
                    ? <h1>Loading Proposal {proposalId}...</h1>
                    :
                    <div>
                        <Card>
                          <CardTitle title={proposal[0].name} subtitle={<span>{new Date(proposal[0].creationDate).toLocaleString()}</span>} />

                          <CardText>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
                            Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
                            Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
                          </CardText>

                          <CardMedia
                            overlay={<CardTitle title={proposal[0].name} subtitle={<span>{new Date(proposal[0].creationDate).toLocaleString()}</span>} />}
                          >
                            <img src={proposal[0].image} />
                          </CardMedia>
                          <CardHeader
                            title="Xav"
                            subtitle="Admin"
                            avatar="/images/user.jpg"
                          />

                          <CardActions>
                            <FlatButton label="Run" />
                            <FlatButton label="Detail" />
                            <FlatButton label="Edit" />
                            <FlatButton label="Delete" />
                          </CardActions>
                        </Card>


                        <h3>Debugging:</h3>
                        <pre>{ JSON.stringify(this.props.data, null, 2) }</pre>



                    </div>
                }
            </div>
        );
    }
}

ProposalView.propTypes = {
    fetchProtectedDataProposals: React.PropTypes.func,
    fetchProtectedData: React.PropTypes.func,
    loaded: React.PropTypes.bool,
    userName: React.PropTypes.string,
    data: React.PropTypes.any,
    token: React.PropTypes.string,
};
