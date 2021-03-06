var utils_1 = require("../lang/utils");
var packageName = 'atom-typescript';
function getConfig(nameLambda) {
    return atom.config.get(packageName + '.' + utils_1.getName(nameLambda));
}
var Config = (function () {
    function Config() {
        this.schema = {
            debugAtomTs: {
                title: 'Debug: Atom-TypeScript. Please do not use.',
                type: 'boolean',
                default: false
            },
            preferredQuoteCharacter: {
                title: 'Preferred quote character',
                type: 'string',
                default: 'none'
            },
            typescriptServices: {
                title: 'Full path (including file name) to a custom `typescriptServices.js`',
                type: 'string',
                default: ''
            },
        };
    }
    Object.defineProperty(Config.prototype, "debugAtomTs", {
        get: function () {
            var _this = this;
            return getConfig(function () { return _this.schema.debugAtomTs; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config.prototype, "preferredQuoteCharacter", {
        get: function () {
            var _this = this;
            return getConfig(function () { return _this.schema.preferredQuoteCharacter; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config.prototype, "typescriptServices", {
        get: function () {
            var _this = this;
            return getConfig(function () { return _this.schema.typescriptServices; });
        },
        enumerable: true,
        configurable: true
    });
    return Config;
})();
var config = new Config();
module.exports = config;
