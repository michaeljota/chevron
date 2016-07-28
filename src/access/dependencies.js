"use strict";

import {
    _each
} from "../util";

/**
 * Loops/recurses over list of dependencies
 * @private
 * @param Array dependencyList to iterate
 * @param Function to run over each dependency
 * @param Function to call on error
 * @return void
 */
//Loops trough dependencies, recurse if new dependencies has dependencies itself; then execute fn.
export default function r(dependencyList, fn, error) {
    _each(dependencyList, name => {
        let service = this.chev[name];

        if (service) {
            //recurse if service has dependencies too
            if (service.deps.length > 0) {
                //recurse
                r.call(this, service.deps, fn, error);
            }
            //run fn
            fn(service);
        } else {
            //if not found error with name
            error(name);
        }
    });
}
