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
import Elements from './components/ElementsView';
import Proposals from './components/ProposalsView';
import Proposal from './components/ProposalView';
import ProposalNew from './components/ProposalNewView';
import Historical from './components/HistoricalView';
import Historicals from './components/HistoricalsView';
import HistoryNewView from './components/HistoryNewView';
import Profile from './components/ProfileView';
import About from './components/AboutView';
import Aggregations from './components/AggregationsView';
import Settings from './components/SettingsView';
import Comparator from './components/ProposalComparatorView';
import Websocket from './components/Websocket';

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
        <Route path="elements" component={requireAuthentication(Elements)} />
        <Route path="proposals" component={requireAuthentication(Proposals)} />
        <Route path="proposals/new" component={requireAuthentication(ProposalNew)} />
        <Route path="proposals/:proposalId" component={requireAuthentication(Proposal)} />
        <Route path="historicals" component={requireAuthentication(Historicals)} />
        <Route path="historicals/new" component={requireAuthentication(HistoryNewView)} />
        <Route path="historicals/:historicalId" component={requireAuthentication(Historical)} />
        <Route path="compare/:elementA/:elementB" component={requireAuthentication(Comparator)} />
        <Route path="aggregations" component={requireAuthentication(Aggregations)} />
        <Route path="profile"   component={requireAuthentication(Profile)} />
        <Route path="settings"   component={requireAuthentication(Settings)} />
        <Route path="about"   component={requireAuthentication(About)} />
        <Route path="websocket"   component={Websocket} />
        <Route path="*" component={DetermineAuth(NotFound)} />
    </Route>
);
