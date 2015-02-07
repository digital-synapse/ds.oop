/// <reference path="/@JSense.js" />
var ds = ds || {};
ds.array = ds.array || {};
ds.object = ds.object || {};
ds.data = ds.data || {};
ds.make = ds.make || {};
ds.make.static = ds.make.static || {};

ds.str = {
    funct: 'function',
    typeRequired: 'The type property is required',
    type: 'type',
    constructor: 'constructor',
    implementstype: 'implementstype',
    sigNotImplementedIn: 'Signature(s) not implemented in ',
    colon: ':',
    colonspace: ': ',
    newline: '\n'
};

ds.safe = function (callback) {
    try {
        callback();
    } catch (e) { // do nothing
    }
};

ds.object.get_methods = function (obj) {
    var result = [];
    for (var id in obj) {
        //ds.safe(function (){
            if (typeof (obj[id]) == ds.str.funct) {
                result[id] = (id + ds.str.colonspace + obj[id].toString());
            }
        //});
    }
    return result;
};

ds.object.get_method_signatures = function (obj) {
    var result = [];
    for (var id in obj) {
        //ds.safe(function () {
            if (typeof (obj[id]) == ds.str.funct) {
                result.push(id + ds.str.colonspace + obj[id].length);
            }
        //});
    }
    return result;
};

// the difference (everything in a1 not in a2) sorry ie8-
ds.array.diff = function (a1, a2) {
    return a1.filter(function (i) { return a2.indexOf(i) < 0; });
};

ds.data.copy = function (src, dest, ignore, addonly, enumerable) {
    /// <summary>
    /// Used to deep clone an object or array
    /// </summary>
    /// <param name="src">(Object|Array):Required - The object to copy from</param>
    /// <param name="dest">(Object|Array) - The object to copy into</param>
    /// <param name="ignore">(Array) - a blacklist of property names/indexes that will not be copied</param>
    /// <param name="addonly">(Bool) - will copy properties/indexes that do not exist in dest</param>
    /// <returns type=""></returns>
    if (typeof addonly === "undefined") addonly = true;
    if (typeof enumerable === 'undefined') enumerable = true;
    if (!dest) dest = src instanceof Array ? [] : {};
    for (var attr in src) {
        var docopy = true;
        if (ignore) {
            if (ignore.indexOf(attr) != -1) docopy = false;
        }
        if (docopy) {
            if (!enumerable) {
                Object.defineProperty(dest, attr, {
                    enumerable: false,
                    writable: true
                });
                
            } 
                if ((addonly && !dest[attr]) || !addonly) {
                    if (typeof src[attr] == ds.str.funct)
                        dest[attr] = src[attr];
                    else if (src[attr] == src)
                        dest[attr] = src;
                    else if (src[attr].constructor === Number || src[attr].constructor === String || src[attr].constructor === Boolean)
                        dest[attr] = src[attr];
                    else
                        dest[attr] = ds.data.copy(src[attr]);
                }
            
        }
    }
    return dest;
};

ds.make.namespace = function (nsstr, code) {
    var t = nsstr.split('.');
    if (t.length == 1) {
        window[t[0]] = window[t[0]] || code;
        return;
    }
    else {
        var obj = window[t[0]] = window[t[0]] || {};
        for (var i = 1; i < t.length - 1; i++) {
            obj[t[i]] = obj[t[i]] || {};
            obj = obj[t[i]];
        }
        obj[t[i]] = obj[t[i]] || code;
        return code;
    }
};

ds.make.enum = function (object) {
    /// <summary>
    /// Used to create an enum object.
    /// The resulting object can be used as both an enumerator and a lookup table
    /// ex:  Colors.Red returns 'FF0000', Colors['FF0000'] returns 'Red'
    /// </summary>
    /// <param name="object">A simple property object ex: { Red: 'FF0000', Green: '00FF00', Blue: '0000FF' }</param>
    /// <returns type="">(ENUM) the enumerator</returns>
    var lut = {};
    var keys = Object.keys(object);
    for (var i = 0; i < keys.length; i++) {
        var prop = object[keys[i]];
        lut[keys[i]] = prop;
        lut[prop] = keys[i];
    }
    return lut;
};

/*
ds.make.proxy = function (subject) {
        var proxy = {};
        Object.getOwnPropertyNames(subject).forEach(function (name) {
            if (name.substring(0, 1) != '_') {
                if (subject[name] instanceof Function) {
                    Object.defineProperty(proxy, name, {
                        get: function () {
                            return subject[name];
                        }
                    });
                } else {
                    Object.defineProperty(proxy, name, {
                        get: function () {
                            return subject[name];
                        },
                        set: function (value) {
                            subject[name] = value;
                        }
                    });
                }
            }
        });
        return proxy;
};

ds.make.newinstance = function(cls) {
    return ds.make.proxy(new cls());
};
*/


ds.make.class = function (details, isStatic) {
    /// <summary>
    /// Used to create a class object with a ds.constructor.
    /// </summary>
    /// <param name="details">(OBJECT) The class definition object. requires a ds.constructor function and a type string.</param>
    /// <returns type="">(CLASS) the class</returns>
    //if (!details.type) throw ds.str.typeRequired;

    var inherit = function (ptype) {
        var implementstype = ptype.type;
        ds.data.copy(ptype, details, [ds.str.type, ds.str.constructor], true);
        return implementstype;
    };

    // inherits?
    if (details.inherits) {
        try {
            // support multiple inheritance with array
            var implementstype;
            if (details.inherits instanceof Array) {
                implementstype = [];
                for (var x = 0; x < details.inherits.length; x++)
                    implementstype.push(inherit(details.inherits[x].prototype));
            } else
                implementstype = inherit(details.inherits.prototype);

            details.inherits = implementstype;
        } catch (e) {
            throw "ERROR: Unable to inherit classes in " + details.type +
                ". Make sure your have created the class with ds.make.class() before attempting to inherit it!";
        }
    }

    // implements?
    var _implements = details['implements']; // apparently implements is a keyword. stupid ecma standards...
    if (_implements) {
        if (!(_implements instanceof Array)) _implements = [_implements];
        for (var z = 0; z < _implements.length; z++) {
            var i = ds.object.get_method_signatures(_implements[z]);
            var o = ds.object.get_method_signatures(details);
            var d = ds.array.diff(i, o);
            if (d.length > 0) {
                var m = ds.object.get_methods(_implements[z]);
                for (var x = 0; x < d.length; x++) {
                    d[x] = m[d[x].substring(0, d[x].indexOf(ds.str.colon))];
                }
                throw ds.str.sigNotImplementedIn + details.type + ds.str.newline + d.join(ds.str.newline);
            }
        }
        _implements = Object.keys(_implements);
    }

    // tmp
    var properties = details.properties;
    var _public = details.public;
    var _private = details.private;

    // NO CONSTRUCTOR
    if (details.constructor.toString().indexOf('function Object()') != -1) {
        details.constructor = function () {
            if (properties) ds.data.copy(properties, this);
            if (_public) ds.data.copy(_public, this);
            if (_private) ds.data.copy(_private, this, false, false, false);
        };
    }
    // HAS CONSTRUCTOR
    else {
        details._constructor = details.constructor;
        details.constructor = function () {
            if (properties) ds.data.copy(properties, this);
            if (_public) ds.data.copy(_public, this);
            if (_private) ds.data.copy(_private, this, false, false, false);
            this._constructor.apply(this, arguments);
        };
    }
    details.constructor.prototype = details;
    var rtn;
    if (isStatic) rtn = new (details.constructor)();
    else rtn = details.constructor;
    if (details.type) ds.make.namespace(details.type, rtn);
    return rtn;
};

ds.make.static.class = function (details) {
    ds.make.class(details, true);
};