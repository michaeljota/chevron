/*
Chevron v3.0.0

Copyright (c) 2016 Felix Rilling

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

"use strict";
import provider from "./provider/provider";
import service from "./provider/service";
import factory from "./provider/factory";

import access from "./access";

let Container = function (name) {
    let _this = this;

    _this.name = name || "cv";
    _this.container = {};

    /*####################/
    * Internal Chevron methods
    /####################*/
    _this.$c = {
        exists(name) {
            return typeof _this.$c.get(name) !== "undefined";
        },
        get(name) {
            return _this.container[name];
        },
    };
};

Container.prototype = {
    /*####################/
    * Main exposed methods
    /####################*/
    //Core service/factory method
    provider,
    //create new service
    service,
    //create new factory
    factory,
    //prepare/iialize services/factory with d injected
    access
};

export default Container;
