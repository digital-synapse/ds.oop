/// <reference path="/@JSense.js" />

var ds = ds || {};
ds.object = ds.object || {};

ds.object.isEqual = function (v1, v2) {
    /// <summary>
    /// Recursive object equality check. also works for primitives as well.
    /// </summary>
    /// <param name="v1"></param>
    /// <param name="v2"></param>
    /// <returns type=""></returns>
    if (typeof v1 == 'object' && typeof v2 == 'object') {
        var p;
        for (p in v1) {
            if (typeof (v2[p]) == 'undefined') { return false; }
        }

        for (p in v1) {
            if (v1[p]) {
                switch (typeof (v1[p])) {
                    case 'object':
                        if (!ds.object.isEqual(v1[p], v2[p])) { return false; } break;
                    case 'function':
                        if (typeof (v2[p]) == 'undefined' ||
                          (p != 'equals' && v1[p].toString() != v2[p].toString())) {
                            return false;
                        }
                        break;
                    default:
                        if (v1[p] != v2[p]) { return false; }
                }
            } else {
                if (v2[p]) {
                    return false;
                }
            }
        }

        for (p in v2) {
            if (typeof (v1[p]) == 'undefined') { return false; }
        }
        return true;
    }
    else {
        // they arent objects. last ditch effort. mabey they are primitives
        return v1 == v2;
    }
};
