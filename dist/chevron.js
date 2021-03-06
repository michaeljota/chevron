var Chevron = (function () {
    'use strict';

    /**
     * Built-in factory constructor.
     *
     * @private
     * @param {*} content
     * @param {Array<*>} dependencies
     */
    const factoryConstructorFn = (content, dependencies) => new (Function.prototype.bind.apply(content, ["", ...dependencies]))();

    /**
     * Built-in service constructor.
     *
     * @private
     * @param {*} content
     * @param {Array<*>} dependencies
     */
    const serviceConstructorFn = (content, dependencies) => 
    // tslint:disable-next-line:only-arrow-functions
    function () {
        return content(...dependencies, ...arguments);
    };

    class Chevron {
        /**
         * Main Chevron class.
         *
         * @public
         * @class Chevron
         */
        constructor() {
            // Container map
            this._ = new Map();
            // Type map
            this.$ = new Map([
                ["service", serviceConstructorFn],
                ["factory", factoryConstructorFn]
            ]);
        }
        /**
         * Set a new dependency on the dependency container.
         *
         * @public
         * @param {string} id
         * @param {string} type
         * @param {string[]} dependencies
         * @param {*} content
         */
        set(id, type, dependencies, content) {
            if (!this.$.has(type)) {
                throw new Error(`Missing type '${type}'.`);
            }
            const entry = [
                false,
                content,
                () => {
                    const dependenciesConstructed = dependencies.map(dependencyName => this.get(dependencyName));
                    entry[1] = this.$.get(type)(entry[1], dependenciesConstructed);
                    entry[0] = true;
                    return entry[1];
                }
            ];
            this._.set(id, entry);
        }
        /**
         * Checks if the content map has a dependency.
         *
         * @public
         * @param {string} id
         * @returns {boolean}
         */
        has(id) {
            return this._.has(id);
        }
        /**
         * Gets a constructed dependency from the content map.
         *
         * @public
         * @param {string} id
         * @returns {*}
         */
        get(id) {
            if (!this.has(id)) {
                return null;
            }
            const entry = this._.get(id);
            return entry[0] ? entry[1] : entry[2]();
        }
    }

    return Chevron;

}());
//# sourceMappingURL=chevron.js.map
