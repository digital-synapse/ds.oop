/// <reference path="/@JSense.js" />

(function () {
    window['ds'] = window['ds'] || {};
    ds['object'] = ds['object'] || {};
    ds['make'] = ds['make'] || {};
    ds['make']['static'] = ds['make']['static'] || {};

    var str = {
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

    var getMethodString = function (obj, signatureOnly) {
        var result = [];
        for (var id in obj) {
            if (typeof (obj[id]) == str.funct) {
                if (signatureOnly)
                    result.push(id + str.colonspace + obj[id].length);
                else
                    result[id] = (id + str.colonspace + obj[id].toString());
            }
        }
        return result;
    };

    // the difference (everything in a1 not in a2) sorry ie8-
    var arrayDiff = function (a1, a2) {
        return a1.filter(function (i) { return a2.indexOf(i) < 0; });
    };

    var objectCopy = ds['object']['copy'] = function (src, dest, ignore, addonly, enumerable) {
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
                    if (typeof src[attr] == str.funct)
                        dest[attr] = src[attr];
                    else if (src[attr] == src)
                        dest[attr] = src;
                    else if (src[attr].constructor === Number || src[attr].constructor === String || src[attr].constructor === Boolean)
                        dest[attr] = src[attr];
                    else
                        dest[attr] = objectCopy(src[attr]);
                }

            }
        }
        return dest;
    };

    /*
    ds.make.namespace = function(nsstr, code) {
    var t = nsstr.split('.');
    if (t.length == 1) {
    window[t[0]] = window[t[0]] || code;
    return;
    } else {
    var obj = window[t[0]] = window[t[0]] || {};
    for (var i = 1; i < t.length - 1; i++) {
    obj[t[i]] = obj[t[i]] || {};
    obj = obj[t[i]];
    }
    obj[t[i]] = obj[t[i]] || code;
    return code;
    }
    };
    */

    ds['make']['enum'] = function (object) {
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


    var makeClass = ds['make']['class'] = function (details, isStatic) {
        /// <summary>
        /// Used to create a class object with a ds.constructor.
        /// </summary>
        /// <param name="details">(OBJECT) The class definition object. requires a ds.constructor function and a type string.</param>
        /// <returns type="">(CLASS) the class</returns>
        //if (!details.type) throw str.typeRequired;

        var inherit = function (ptype) {
            var implementstype = ptype.type;
            objectCopy(ptype, details, [str.type, str.constructor], true);
            return implementstype;
        };

        // inherits?
        var inherits = details['inherits'];
        if (inherits) {
            try {
                // support multiple inheritance with array
                var implementstype;
                if (inherits instanceof Array) {
                    implementstype = [];
                    for (var x = 0; x < inherits.length; x++)
                        implementstype.push(inherit(inherits[x].prototype));
                } else
                    implementstype = inherit(inherits.prototype);

                inherits = implementstype;
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
                var i = getMethodString(_implements[z], true);
                var o = getMethodString(details, true);
                var d = arrayDiff(i, o);
                if (d.length > 0) {
                    var m = getMethodString(_implements[z]);
                    for (var x = 0; x < d.length; x++) {
                        d[x] = m[d[x].substring(0, d[x].indexOf(str.colon))];
                    }
                    throw str.sigNotImplementedIn + details.type + str.newline + d.join(str.newline);
                }
            }
            _implements = Object.keys(_implements);
        }

        // tmp
        var properties = details['properties'];
        var _public = details['public'];
        var _private = details['private'];

        // NO CONSTRUCTOR
        if (details.constructor.toString().indexOf('function Object()') != -1) {
            details.constructor = function () {
                if (properties) objectCopy(properties, this);
                if (_public) objectCopy(_public, this);
                if (_private) objectCopy(_private, this, false, false, false);
            };
        }
        // HAS CONSTRUCTOR
        else {
            details._constructor = details.constructor;
            details.constructor = function () {
                if (properties) objectCopy(properties, this);
                if (_public) objectCopy(_public, this);
                if (_private) objectCopy(_private, this, false, false, false);
                this._constructor.apply(this, arguments);
            };
        }
        details.constructor.prototype = details;
        var rtn;
        if (isStatic) rtn = new (details.constructor)();
        else rtn = details.constructor;
        //if (details.type) ds.make.namespace(details.type, rtn);
        return rtn;
    };

    ds['make']['static']['class'] = function (details) {
        return makeClass(details, true);
    };

})()