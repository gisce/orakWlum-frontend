/* eslint max-len: 0, no-param-reassign: 0 */
import React from 'react';

import { DEBUG } from '../constants';

export function debug(what) {
    var debug = DEBUG;

    return (
        debug &&
        <div>
            <h3>Debug:</h3>
            <pre>{ JSON.stringify(what, null, 2) }</pre>
        </div>
    );
}
