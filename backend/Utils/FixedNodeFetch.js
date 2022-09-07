"use strict";
exports.__esModule = true;
// eslint-disable-next-line no-eval
var fetchPromise = eval('import("node-fetch")').then(function (mod) { return mod["default"]; });
var exportedFetch = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return fetchPromise.then(function (fetch) { return fetch.apply(void 0, args); });
};
exports["default"] = exportedFetch;
