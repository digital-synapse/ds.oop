/// <reference path="/@JSense.js" />
var ds = ds || {};
ds.data = ds.data || {};

ds.forx = function (object, callback, childname) {
    /// <summary>
    /// A recursive for each loop, useful for enumerating a tree structure 
    /// </summary>
    /// <param name="object">(OBJECT || ARRAY) the root(s) to enumerate recursively</param>
    /// <param name="callback">(FUNCTION) a callback function - should accept an object parameter</param>
    /// <param name="childname">
    /// (STRING : optional) Defaults to 'children' if provided executes a faster optimized iterator. 
    /// otherwise executes a slower iterator that iterates any collections in the structure. provides 
    /// additional callback parameters. ex: callback(object, level, parent, isLeaf, isRoot)</param>
    var _forx = function (object) {
        if (ds.isObject(object)) {
            if (ds.isArray(object[childname])) {
                for (var x = 0; x < object[childname].length; x++) {
                    _forx(object[childname][x]);
                }
            }
            callback(object);
        }
    };

    var _forxslow = function (object, level, parent) {
        var isLeaf = true;
        if (ds.isObject(object)) {
            var keys = Object.keys(object);
            for (var i = 0; i < keys.length; i++) {
                var prop = object[keys[i]];
                if (ds.isArray(prop) && prop.length > 0) {
                    isLeaf = false;
                    for (var x = 0; x < prop.length; x++)
                        _forxslow(prop[x], level++, object);
                }
            }
        }
        else if (ds.isArray(object)) {
            isLeaf = false;
            for (var i = 0; i < object.length; i++) {
                _forxslow(object[i], level++, object);
            }
            return; // dont callback for an array
        };
        var isRoot = level === 0;
        callback(object, level, parent, isLeaf, isRoot);
    };

    var start = function (root) {
        if (!childname && ds.isArray(root.children)) {
            childname = 'children';
            if (ds.isArray(root)) {
                for (var i = 0; i < root.length; i++) 
                    _forx(root[i], callback);
            }
            else _forx(root, callback);
        }
        else _forxslow(root, callback, 0, null);
    };

    if (ds.get_type(object) == 'Tree')
        start(object.root);
    else {
        if (ds.isObject(object) || ds.isArray(object)) {
            start(object);
        }
        else {
            throw 'forx requires an object or array as input';
        }
    }
};