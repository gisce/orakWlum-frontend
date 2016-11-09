/* eslint new-cap: 0 */

import React from 'react';
import { Route } from 'react-router';

/* containers */
import { App } from './containers/App';
import { HomeContainer } from './containers/HomeContainer';
import LoginView from './components/LoginView';
import RegisterView from './components/RegisterView';
import ProtectedView from './components/ProtectedView';
import Analytics from './components/Analytics';
import NotFound from './components/NotFound';
import Proposals from './components/ProposalsView';
import Proposal from './components/ProposalView';
import Proposals0 from './components/ProposalsView0';
import Proposal0 from './components/ProposalView0';
import Profile from './components/ProfileView';

import { DetermineAuth } from './components/DetermineAuth';
import { requireAuthentication } from './components/AuthenticatedComponent';
import { requireNoAuthentication } from './components/notAuthenticatedComponent';

export default (
    <Route path="/" component={App}>
        <Route path="main" component={requireAuthentication(ProtectedView)} />
        <Route path="login" component={requireNoAuthentication(LoginView)} />
        <Route path="register" component={requireNoAuthentication(RegisterView)} />
        <Route path="home" component={requireNoAuthentication(HomeContainer)} />
        <Route path="history" component={requireAuthentication(Analytics)} />
        <Route path="proposalsOld" component={requireAuthentication(Proposals)} />
        <Route path="proposalsOld/:proposalId" component={requireAuthentication(Proposal)} />
        <Route path="proposals" component={requireAuthentication(Proposals0)} />
        <Route path="proposals/:proposalId" component={requireAuthentication(Proposal0)} />
        <Route path="profile"   component={requireAuthentication(Profile)} />
        <Route path="*" component={DetermineAuth(NotFound)} />
    </Route>
);
