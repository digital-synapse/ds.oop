/// <reference path="/@JSense.js" />
var ds = ds || {};
ds.array = ds.array || {};

// the symetric difference of 2 arrays
ds.array.diffs = function (a1, a2) {
    var a = [], diff = [], i;
    for (i = 0; i < a1.length; i++) {
        a[a1[i]] = true;
    }
    for (i = 0; i < a2.length; i++) {
        if (a[a2[i]]) {
            delete a[a2[i]];
        }
        else {
            a[a2[i]] = true;
        }
    }
    for (i in a) {
        diff.push(i);
    }
    return diff;
};

ds.array.where = function (array, callback) {
    var output = [], i = 0, n;
    for (n = 0; n < array.length; n++) {
        if (callback(array[n])) {
            output[i++] = array[n];
        }
    }
    return output;
};

ds.array.select = function (array) {
    var output = [], i = 0, n, k;
    if (arguments.length == 2) {
        var key = arguments[1];
        for (n = 0; n < array.length; n++) {
            output[n] = array[n][key];
        }
    }
    else {
        for (n = 0; n < array.length; n++) {
            var item = array[n];
            var newitem = {};
            for (k = 1; k < arguments.length; k++) {
                var key = arguments[k];
                newitem[key] = item[key]
            }
            output[i++] = newitem;
        }
    }
    return output;
};