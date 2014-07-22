// --- just some helper functions
console.log = function (str) {
    var text = document.createTextNode(str+'\n');
    var e = document.getElementById('logme');
    e.appendChild(text);
};
var strinsert= function (output, index, string) {
    if (index > 0)
        return output.substring(0, index) + string + output.substring(index, output.length);
    else
        return string + output;
};
function logtest(test, output, expected) {
    var log = test + ':                                                                            ';
    log = strinsert(log,40, output);
    if (output === expected) log = strinsert(log,80, '...ok');
    else log = strinsert(log,80, '...fail')
    console.log(log.trim());
};

// starting the tests now...
console.log('--- CLASS TESTS ----');

var a = ds.class({
    type: 'a',
    constructor: function () { },
    mul: function (s) {
        this.x *= s;
        return this;
    }
});
var b = ds.class({
    type: 'b',
    inherits: a,
    constructor: function (x) { this.x = x; },
    sub: function (s) {
        this.x -= s;
        return this;
    }
});
var c = ds.class({
    type: 'c',
    constructor: function () { this.x = 2; },
    add: function (s) {
        this.x += s;
        return this;
    }
});
var d = ds.class({
    type: 'd',
    inherits: [b, c],
    constructor: function (val) {
        this.x = val;
    },
    div: function (s) {
        this.x /= s;
        return this;
    }
});

var bobj = new b(3);
bobj.sub(1).mul(3);
logtest('class test (single inheritance)', bobj.x, 6);

var dobj = new d(2);
dobj.mul(2).sub(1).div(3).add(1);
logtest('class test (multiple inheritance)', dobj.x, 2);

var cc = ds.class({
    type: 'c',
    inherits: b,
    constructor: function (x) { this.x = x; },
    add: function (s) {
        this.x += s;
        return this;
    }
});

var cobj = new cc(3);
cobj.add(3).mul(2).sub(11);
logtest('class test (multilevel inheritance)', cobj.x, 1);


var Dog = ds.class({
    type: 'Dog',
    constructor: function () { },
    bark: function () { return "WOOF WOOF"; }
});
var Hound = ds.class({
    type: 'Hound',
    inherits: Dog,
    constructor: function () { },
    bark: function () { return "Howl"; }
});
var Puppy = ds.class({
    type: 'Puppy',
    inherits: Dog,
    constructor: function () { },
    bark: function () { return "yip yip yip"; }
});
var BabyBasset = ds.class({
    type: 'BabyBasset',
    inherits: [Hound, Puppy],
    constructor: function () { }
});
var babyBasset = new BabyBasset();

/* for hybrid inheritance, precedence is always in the same order as the inherits block
   
- in this case. the bark function should inherit from Hound since it was specified first 
- If Hound did not implement bark then the bark method in Dog would be inherited
- if neither Hound or Dog implemented bark then the bark method in Puppy would be inherited.   
*/
logtest('class test (hybrid inheritance)', babyBasset.bark(), 'Howl');



var Vehicle = ds.class({
    type: 'Vehicle',
    constructor: function () { },
    description: function () {
        return 'vehicle';
    }
});

var Truck = ds.class({
    type: 'Truck',
    inherits: Vehicle,
    constructor: function () { },
    description: function () {
        return 'truck';
    }

});

var Car = ds.class({
    type: 'Car',
    inherits: Vehicle,
    constructor: function () { },
    description: function () {
        return 'car';
    }
});

var collection = [new Vehicle(), new Truck(), new Car(), new Car()];

output = [];
for (var i = 0; i < collection.length; i++) {
    output.push(collection[i].description());
}
var result = output.join();
logtest('class test (hierarchical inheritance)', result, 'vehicle,truck,car,car');

var output = [];
for (var i = 0; i < collection.length; i++) {
    output.push(collection[i].description());
}
var result = output.join();
logtest('class test (polymorphism)', result, 'vehicle,truck,car,car');


var expected = false;
try {
    var ICar = {
        make: function (make) { },
        model: function (model) { },
        year: function (year) { }

    };

    var Car = ds.class({
        type: 'InterfaceTest',
        implements: ICar,
        constructor: function () { },
        description: function () {
            return 'a car';
        },
        make: function (make) {
            return make;
        }
    });
}
catch (e) {
    expected = true;
}
logtest('class test (interface enforcement)', expected, true);


var expected = true;
try {
    var I1 = {
        f1: function (a, b, c) { }
    };
    var I2 = {
        f2: function (a, b, c) { }
    };
    var C1 = ds.class({
        type: 'C1',
        implements: [I1, I2],
        constructor: function () { },
        f1: function (a, b, c) { return a + b + c; },
        f2: function (a, b, c) { return a - b - c; }
    });
}
catch (e) {
    expected = false;
}
logtest('class test (multiple interfaces)', expected, true);


