/// <reference path="/@JSense.js" />
var ds; if (!ds) ds = {};

ds['get_type'] = function (thing) {
	/// <summary>
	/// Attempts to get the class type of the object 
	/// </summary>
	/// <param name="thing"></param>
	/// <returns type=""></returns>
    if (thing ===undefined) return '[object Undefined]';
    if (thing === null) return "[object Null]"; // special case
    var t = thing.__proto__.type;
    return t ? t : Object.prototype.toString.call(thing); //.slice(8,-1);
};

ds['type'] = ds.make.enum({
    Null: '[object Null]',
    Object: '[object Object]',
    Array: '[object Array]',
    Function: '[object Function]'
});

ds['isNull']= function(o) {
    return ds.get_type(o) == ds.type.Null;
};
ds['isArray']= function(o) {
    return ds.get_type(o) == ds.type.Array;
};
ds['isObject']= function(o) {
    return ds.get_type(o) == ds.type.Object;
};


