import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/proposals';

import { ProposalList } from './ProposalList';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

function mapStateToProps(state) {
    return {
        data: state.proposals,
        token: state.auth.token,
        loaded: state.proposals.loaded,
        isFetching: state.proposals.isFetching,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

const style = {
    buttonAdd: {
        marginRight: 20,
    },
    buttonPosition: {
        textAlign: 'right',
    }
};



@connect(mapStateToProps, mapDispatchToProps)
export default class ProposalsView extends React.Component {
    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        const token = this.props.token;
        this.props.fetchProtectedDataProposals(token);
    }

    addProposal() {
        console.log("add new proposal");
    }

    render() {
        const addProposal = (
            <FloatingActionButton style={style.buttonAdd} onClick={() => this.addProposal()}>
              <ContentAdd />
            </FloatingActionButton>
        )

        return (
            <div>
                {!this.props.loaded
                    ? <h1>Loading Proposals...</h1>
                    :
                    <div>
                        <div className='row'>
                            <div className="col-md-6"><h1>Proposals list</h1></div>
                            <div className="col-md-6" style={style.buttonPosition}>{addProposal}</div>
                        </div>

                        <ProposalList
                            title="Last proposals"
                            proposals={this.props.data.data}
                            path={this.props.location.pathname}
                        />

                        <h3>Proposals:</h3>
                        <pre>{ JSON.stringify(this.props.data, null, 2) }</pre>

                    </div>
                }
            </div>
        );
    }
}

ProposalsView.propTypes = {
    fetchProtectedDataProposals: React.PropTypes.func,
    fetchProtectedData: React.PropTypes.func,
    loaded: React.PropTypes.bool,
    userName: React.PropTypes.string,
    data: React.PropTypes.any,
    token: React.PropTypes.string,
};
