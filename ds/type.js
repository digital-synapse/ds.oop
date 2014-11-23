/// <reference path="/@JSense.js" />
var ds = ds || {};

ds.type = function (thing) {
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

TYPE = ds.make.enum({
    Null: '[object Null]',
    Object: '[object Object]',
    Array: '[object Array]',
    Function: '[object Function]'
});

ds.isNull= function(o) {
    return ds.type(o) == TYPE.Null;
};
ds.isArray= function(o) {
    return ds.type(o) == TYPE.Array;
};
ds.isObject= function(o) {
    return ds.type(o) == TYPE.Object;
};


