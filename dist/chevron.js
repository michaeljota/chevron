"use strict";

var Chevron = function () {
    'use strict';

    var _part1 = ": ";
    var _factory = "factory";
    var _service = "service";
    var _error = _part1 + "error in ";
    var _isUndefined = " is undefined";

    /**
     * Checks if service exist, else add it
     * @param String name to register/id the service
     * @param Array list of dependencies
     * @param String type of service (service/factory)
     * @param Function content of the service
     * @return this
     */
    function provider(name, deps, type, fn, args) {
        var _this = this;

        if (_this.chev[name]) {
            //throw error if a service with this name already exists
            throw "" + _this.id + _error + type + _part1 + _service + " '" + name + "' is already defined";
        } else {
            //Add the service to container
            _this.chev[name] = {
                name: name,
                type: type,
                deps: deps,
                args: args || [],
                fn: fn,
                init: false
            };

            return _this;
        }
    }

    /**
     * Create a new service
     * @param String name to register/id the service
     * @param Array list of dependencies
     * @param String type of service (service/factory)
     * @param Function content of the service
     * @return this
     */
    function service(name, deps, fn) {
        return this.provider(name, deps, _service, fn);
    }

    /**
     * Create a new factory
     * @param String name to register/id the service
     * @param Array list of dependencies
     * @param String type of service (service/factory)
     * @param Function content of the service
     * @param Array factory arguments
     * @return this
     */
    function factory(name, deps, Constructor, args) {
        return this.provider(name, deps, _factory, Constructor, args);
    }

    var _each = function _each(arr, fn) {
        for (var i = 0, l = arr.length; i < l; i++) {
            fn(arr[i], i);
        }
    };
    var _eachObject = function _eachObject(object, fn) {
        var keys = Object.keys(object);

        _each(keys, function (key, i) {
            fn(object[key], key, i);
        });
    };

    /**
     * Initializes service/function
     * @private
     * @param Object service to check
     * @param Object bundle of dependencies
     * @return Object service
     */
    function initialize(service, bundle) {
        if (service.type === _service) {
            (function () {
                //Construct service
                var serviceFn = service.fn;

                service.fn = function () {
                    //Chevron service function wrapper
                    return serviceFn.apply(null, bundle.concat(Array.from(arguments)));
                };
            })();
        } else {
            //Construct factory
            bundle = bundle.concat(service.args);
            //first value gets ignored by calling new like this, so we need to fill it
            bundle.unshift(null);
            //Apply into new constructor by accessing bind proto. from: http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
            service.fn = new (Function.prototype.bind.apply(service.fn, bundle))();
        }

        service.init = true;
        return service;
    }

    /**
     * Collects dependencies and initializes service
     * @private
     * @param Object service to check
     * @param Object list of dependencies
     * @return Object service
     */
    function bundle(service, list) {
        var bundle = [];

        if (!service.init) {
            //Collect dependencies for this service
            _eachObject(list, function (item, key) {
                if (service.deps.indexOf(key) !== -1) {
                    bundle.push(item);
                }
            });

            return initialize(service, bundle);
        } else {
            return service;
        }
    }

    /**
     * Loops/recurses over list of dependencies
     * @private
     * @param Array dependencyList to iterate
     * @param Function to run over each dependency
     * @param Function to call on error
     * @return void
     */
    //Loops trough dependencies, recurse if new dependencies has dependencies itself; then execute fn.
    function r(dependencyList, fn, error) {
        var _this2 = this;

        _each(dependencyList, function (name) {
            var service = _this2.chev[name];

            if (service) {
                //recurse if service has dependencies too
                if (service.deps.length > 0) {
                    //recurse
                    r.call(_this2, service.deps, fn, error);
                }
                //run fn
                fn(service);
            } else {
                //if not found error with name
                error(name);
            }
        });
    }

    /**
     * Check if every dependency is available
     * @private
     * @param Object service to check
     * @return bound service
     */
    function prepare(service) {
        var _this3 = this;

        var list = {};

        //Recurse trough service deps
        r.call(this, service.deps,
        //run this over every dependency to add it to the dependencyList
        function (dependency) {
            //make sure if dependency is initialized, then add
            list[dependency.name] = bundle(dependency, list).fn;
        },
        //error if dependency is missing
        function (name) {
            throw "" + _this3.id + _error + service.name + _part1 + "dependency '" + name + "'" + _isUndefined;
        });

        return bundle(service, list);
    }

    /**
     * Access service with dependencies bound
     * @param String name of the service
     * @return Function with dependencies bound
     */
    function access(name) {
        var _this = this,
            accessedService = _this.chev[name];

        //Check if accessed service is registered
        if (accessedService) {
            //Call prepare with bound context
            return prepare.call(_this, accessedService).fn;
        } else {
            //throw error if service does not exist
            throw "" + _this.id + _error + name + _part1 + "'" + name + "'" + _isUndefined;
        }
    }

    /**
     * Basic Chevron Constructor
     * @constructor
     * @param String to id the container
     */
    var Chevron = function Chevron(id) {
        this.id = id || "cv";
        this.chev = {};
    };

    /**
     * Expose Chevron methods
     */
    Chevron.prototype = {
        //Core service/factory method
        provider: provider,
        //Create new service
        service: service,
        //Create new factory
        factory: factory,
        //Prepare/init services/factory with deps injected
        access: access
    };

    return Chevron;
}();
//# sourceMappingURL=chevron.js.map
