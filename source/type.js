/// <reference path="/@JSense.js" />

(function () {
    window['ds'] = window['ds'] || {};

    var dstype = ds['type'] = function (thing) {
        /// <summary>
        /// Attempts to get the class type of the object 
        /// </summary>
        /// <param name="thing"></param>
        /// <returns type=""></returns>
        if (thing === undefined) {
            return '[object Undefined]';
        }
        if (thing === null) {
            return "[object Null]"; // special case
        }
        var t = thing.__proto__.type;

        if (!this.prototype) {
            return t ? t : Object.prototype.toString.call(thing); //.slice(8,-1);
        } else {
            var tt = thing.prototype.type;
            return t ? t : (tt ? tt : Object.prototype.toString.call(thing));
        }
    };
                                            // enum is a reserved word :(
    var dsTYPE = window['TYPE'] = ds['make']['enum']({
        Null: '[object Null]',
        Object: '[object Object]',
        Array: '[object Array]',
        Function: '[object Function]',
        Undefined: '[object Undefined]'
    });

    ds['isNull'] = function (o) {
        return dstype(o) == dsTYPE.Null;
    };
    ds['isArray'] = function (o) {
        return dstype(o) == dsTYPE.Array;
    };
    ds['isObject'] = function(o) {
        return dstype(o) == dsTYPE.Object;
    };
    ds['isFunction'] = function (o) {
        return dstype(o) == dsTYPE.Function;
    };
    ds['isUndefined'] = function (o) {
        return dstype(o) == dsTYPE.Undefined;
    };
})()


