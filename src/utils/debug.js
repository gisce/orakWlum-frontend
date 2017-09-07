/* eslint max-len: 0, no-param-reassign: 0 */
import React from 'react';

import { DEBUG } from '../constants';

export function debug(what) {
    console.log(window.location.search);

    const params = window.location.search.substring(1).split("&")

    let matched = false;
    for (let i=0; i<params.length; i++) {
        if (params[i] == "debug")
            matched = true;
    }

    const activate_debug = matched || DEBUG;

    activate_debug && console.debug(what);

    return (
        activate_debug &&
        <div>
            <h3>Debug:</h3>
            <pre>{ JSON.stringify(what, null, 2) }</pre>
        </div>
    );
}
