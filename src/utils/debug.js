/* eslint max-len: 0, no-param-reassign: 0 */
import React from 'react';

export function debug(what) {
    var debug = false;
    debug = localStorage.getItem('debug');

    return (
        debug &&
        <div>
            <h3>Debug:</h3>
            <pre>{ JSON.stringify(what, null, 2) }</pre>
        </div>
    );
}
