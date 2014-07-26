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