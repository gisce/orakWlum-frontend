/* eslint new-cap: 0 */

import React from 'react';
import { Route, Redirect } from 'react-router';

/* containers */
import { App } from './containers/App';
import { HomeContainer } from './containers/HomeContainer';
import LoginView from './views/LoginView';
import RegisterView from './views/RegisterView';
import Analytics from './views/Analytics';
import NotFound from './views/NotFound';
import Profile from './views/ProfileView';
import About from './views/AboutView';
import Aggregations from './views/AggregationsView';
import Settings from './views/SettingsView';

import ElementsListOld from './views/ElementsListOld';
import ElementsList from './views/ElementsList';
import Element from './views/ElementView';
import ElementsNew from './views/ElementsNewView';
import Concatenator from './views/ElementsConcatenation';
import Comparator from './views/ElementsComparationView';

import { DetermineAuth } from './components/DetermineAuth';
import { requireAuthentication } from './components/AuthenticatedComponent';
import { requireNoAuthentication } from './components/notAuthenticatedComponent';
import { requireUnauthentication } from './views/Logout';


export default (
    <Route path="/" component={App}>
        <Redirect from="" to="elements" />
        <Route path="login" component={requireNoAuthentication(LoginView)} />
        <Route path="register" component={requireNoAuthentication(RegisterView)} />
        <Route path="home" component={requireNoAuthentication(HomeContainer)} />

        <Route name="logout" path="logout" component={requireUnauthentication()} />
        <Route path="history" component={requireAuthentication(Analytics)} />
        <Route path="aggregations" component={requireAuthentication(Aggregations)} />
        <Route path="profile"   component={requireAuthentication(Profile)} />
        <Route path="settings"   component={requireAuthentication(Settings)} />
        <Route path="about"   component={requireAuthentication(About)} />

        <Redirect from="main" to="elements" />
        <Route name="elements" path="elements" component={requireAuthentication(ElementsList)} />
        <Route name="elementsOld" path="elementsOld" component={requireAuthentication(ElementsListOld)} />
        <Route name="elements.type:historical" path="elements/type/historical" component={ElementsList} />
        <Route name="elements.type:proposal" path="elements/type/proposal" component={ElementsList} />
        <Redirect from="elements/type/all" to="elements" />

        <Redirect from="elements/concatenate" to="elements" />

        <Route name="elements.create" path="elements/new" component={requireAuthentication(ElementsNew)} />
        <Route name="elements.create" path="elements/new/:day_start/:day_end" component={requireAuthentication(ElementsNew)} />

        <Route name="Element" path="elements/:elementID" component={requireAuthentication(Element)} />
        <Route name="ElementsConcatenation" path="elements/concatenate/:elementsList" component={requireAuthentication(Concatenator)} />
        <Route name="ElementsComparator" path="elements/compare/:elementA/:elementB" component={requireAuthentication(Comparator)} />

        <Route path="*" component={NotFound} />

    </Route>
);
