/// <reference path="/@JSense.js" />
var ds; if (!ds) ds = {};
if (!ds.array) ds.array ={};
if (!ds.object) ds.object ={};
if (!ds.data) ds.data ={};

ds.str = {
    funct: 'function',
    typeRequired: 'The type property is required',
    type: 'type',
    constructor: 'constructor',
    basetype: 'basetype',
    sigNotImplementedIn: 'Signature(s) not implemented in ',
    colon: ':',
    colonspace: ': ',
    newline: '\n'
};


ds.object.get_methods = function (obj) {
        var result = [];
        for (var id in obj) {
            try {
                if (typeof (obj[id]) == ds.str.funct) {
                    result[id]=(id + ds.str.colonspace + obj[id].toString());
                }
            } catch (e) {
                // enumerating some built in methods will cause an error in firefox                        
            }
        }
        return result;
    };

ds.object.get_method_signatures= function (obj) {
        var result = [];
        for (var id in obj) {
            try {
                if (typeof (obj[id]) == ds.str.funct) {
                    result.push(id + ds.str.colonspace + obj[id].length);
                }
            } catch (e) {
                // enumerating some built in methods will cause an error in firefox                        
            }
        }
        return result;
    };

ds.object.countProps= function (obj) {
        var count = 0;
        for (k in obj) {
            if (obj.hasOwnProperty(k)) {
                count++;
            }
        }
        return count;
    };

// the difference (everything in a1 not in a2)
ds.array.diff= function (a1, a2) {
        return a1.filter(function (i) { return a2.indexOf(i) < 0; });
    };

ds.data.copy= function (src, dest, ignore, addonly) {
        /// <summary>
        /// Used to deep clone an object or array
        /// </summary>
        /// <param name="src">(Object|Array):Required - The object to copy from</param>
        /// <param name="dest">(Object|Array) - The object to copy into</param>
        /// <param name="ignore">(Array) - a blacklist of property names/indexes that will not be copied</param>
        /// <param name="addonly">(Bool) - will copy properties/indexes that do not exist in dest</param>
        /// <returns type=""></returns>
        if (addonly == undefined) addonly = true;
        if (dest == undefined) dest = src instanceof Array ? [] : {};
        for (var attr in src) {
            var docopy = true;
            if (ignore != undefined) {
                if (ignore.indexOf(attr) != -1) docopy = false;
            }
            if (docopy) {
                if (typeof src[attr] == ds.str.funct) {
                    if ((addonly && dest[attr] == undefined) || !addonly)
                        dest[attr] = src[attr];
                }
                else if (src[attr] == src) {
                    if ((addonly && dest[attr] == undefined) || !addonly)
                        dest[attr] = src;
                }
                else {
                    if ((addonly && dest[attr] == undefined) || !addonly)
                        dest[attr] = ds.data.copy(src[attr]);
                }
            }
        }
        return dest;
    };

ds.class = function (details) {
        /// <summary>
        /// Used to create a class object with a ds.constructor. 
        /// </summary>
        /// <param name="details">(OBJECT) The class definition object. requires a ds.constructor function and a type string.</param>
        /// <returns type="">(CLASS) the class</returns>
        if (details.type == undefined) throw ds.str.typeRequired;

        // inherits?
        if (details.inherits) {
            // support multiple inheritance with array
            var basetype;
            if (details.inherits instanceof Array) {
                basetype = [];
                for (var x = 0; x < details.inherits.length; x++) {
                    basetype[x] = details.inherits[x].prototype.type;
                    ds.data.copy(details.inherits[x].prototype, details, [ds.str.type, ds.str.constructor, ds.str.basetype], true);
                }
            }
            else {
                basetype = details.inherits.prototype.type;
                ds.data.copy(details.inherits.prototype, details, [ds.str.type, ds.str.constructor, ds.str.basetype], true);
            }
            details.inherits = basetype;
        }

        // implements? 
        var _implements = details['implements'];  // apparently implements is a keyword. stupid ecma standards...
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

        // inject ds.constructor
        details.constructor.prototype = details;
        return details.constructor;
    };

ds.enum = function (object) {
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

