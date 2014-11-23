/// <reference path="/@JSense.js" />

// --- just some helper functions
var console = {};
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
    //log = strinsert(log,40, output);
    if (output === expected) log = strinsert(log,40, 'ok');
    else log = strinsert(log,40, 'fail...  '+output)
    console.log(log.trim());
};

// starting the tests now...
console.log('\n--- CLASS TESTS ----');

var a = ds.make.class({
    type: 'a',
    constructor: function () { },
    mul: function (s) {
        this.x *= s;
        return this;
    }
});
var b = ds.make.class({
    type: 'b',
    inherits: a,
    constructor: function (x) { this.x = x; },
    sub: function (s) {
        this.x -= s;
        return this;
    }
});
var c = ds.make.class({
    type: 'c',
    constructor: function () { this.x = 2; },
    add: function (s) {
        this.x += s;
        return this;
    }
});
var d = ds.make.class({
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

var cc = ds.make.class({
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


var Dog = ds.make.class({
    type: 'Dog',
    constructor: function () { },
    bark: function () { return "WOOF WOOF"; }
});
var Hound = ds.make.class({
    type: 'Hound',
    inherits: Dog,
    constructor: function () { },
    bark: function () { return "Howl"; }
});
var Puppy = ds.make.class({
    type: 'Puppy',
    inherits: Dog,
    constructor: function () { },
    bark: function () { return "yip yip yip"; }
});
var BabyBasset = ds.make.class({
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


var Vehicle = ds.make.class({
    type: 'Vehicle',
    constructor: function () { },
    description: function () {
        return 'vehicle';
    }
});

var Truck = ds.make.class({
    type: 'Truck',
    inherits: Vehicle,
    constructor: function () { },
    description: function () {
        return 'truck';
    }

});

var Car = ds.make.class({
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

    var Car = ds.make.class({
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
    var C1 = ds.make.class({
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


ds.make.class({
    type: 'ConstructorlessClass',
    pow2: function (x) { return x * x; }
});
var noconst = new ConstructorlessClass();
logtest('class test (constructorless class)', noconst.pow2(5) == 25, true);

ds.make.static.class({
    type: 'Test.StaticClass',
    constructor: function () {
        this.x = 5;
    }
});
logtest('class test (static class)', Test.StaticClass.x == 5, true);


logtest('class test (get type)',
    ds.type(Test.StaticClass) == 'Test.StaticClass' &&
    ds.type(noconst) == 'ConstructorlessClass' &&
    ds.type({}) == TYPE.Object &&
    ds.type([]) == TYPE.Array && 
    ds.type(function() {}) == TYPE.Function, true);


console.log('\n--- LIST TESTS ----');

var list = new ds.data.list(1, 2, 3);

logtest('new list()', list.toArray().join(), '1,2,3');

list.empty();
logtest('list.empty()', list.count, 0);

list.add(1);
list.add(2);
list.add(3);
logtest('list.add()', list.toArray().join(), '1,2,3');

logtest('list.at()', list.at(1), 2);
logtest('list.first()', list.first(), 1);
logtest('list.last()', list.last(), 3);

list.removeAt(1);
logtest('list.removeAt()', list.toArray().join(), '1,3');

list.remove(3);
logtest('list.remove()', list.toArray().join(), '1');

list.add(3);
list.addAt(2, 1);
//logtest('list.addAt()', list.toArray().join(), '1,2,3');

list.addAt(0, 0);
//logtest('list.addAt()', list.toArray().join(), '0,1,2,3');

list.addAt(4, 4);
logtest('list.addAt()', list.toArray().join(), '0,1,2,3,4');

list.removeAt(4);
//logtest('list.removeAt()', list.toArray().join(), '0,1,2,3');

list.removeAt(0);
//logtest('list.removeAt()', list.toArray().join(), '1,2,3');

list.removeFirst();
logtest('list.removeFirst()', list.toArray().join(), '2,3');

list.removeLast();
logtest('list.removeLast()', list.toArray().join(), '2');

list = new ds.data.list(1, 2, 3, 4, 5);
logtest('list.indexOf()', list.indexOf(3), 2);



console.log('\n--- DICTIONARY TESTS ----');

var dict = new ds.data.dictionary({
    one: 1,
    two: 2,
    three: 3
});

logtest('new dictionary()', dict.toArray().join(), '1,2,3');

dict.empty();
logtest('dictionary.empty()', dict.count, 0);

dict.add(1, 3);
dict.add(2, 2);
dict.add(3, 1);
logtest('dictionary.add()', dict.toArray().join(), '3,2,1');

logtest('dictionary.at()', dict.at(1), 3);

dict.removeAt(1);
logtest('dictionary.removeAt()', dict.toArray().join(), '2,1');

dict.remove(1);
logtest('dictionary.remove()', dict.toArray().join(), '2');

dict.add('key', 'new');
logtest('dictionary.keys()', dict.keys().join(), '2,key');


console.log('\n--- STACK TESTS ----');

var stack = new ds.data.stack(1, 2, 3);
logtest('new stack()', stack.toArray().join(), '1,2,3');

stack.push(4);
logtest('stack.push()', stack.toArray().join(), '1,2,3,4');

logtest('stack.pop()', stack.pop(), 4);

var peek = stack.peek();
logtest('stack.peek()', peek, 3);

stack.empty();
logtest('stack.empty()', stack.count, 0);

console.log('\n--- QUEUE TESTS ----');

var queue = new ds.data.queue(1, 2, 3);
logtest('new queue()', queue.toArray().join(), '1,2,3');

queue.enqueue(4);
logtest('queue.enqueue()', queue.toArray().join(), '1,2,3,4');

logtest('queue.dequeue()', queue.dequeue(), 1);

var peek = queue.peek();
logtest('queue.peek()', peek, 2);

queue.empty();
logtest('queue.empty()', queue.count, 0);


console.log('\n--- TREE TESTS ----');

var tree = new ds.data.tree({
    name: 'root',
    children: [{
        name: 'child1',
        children: [{
            name: 'leaf1'
        }]
    }, {
        name: 'child2',
        children: [{
            name: 'leaf2'
        }]
    }, {
        name: 'child3',
        children: [{
            name: 'leaf3'
        }]
    }]
});

logtest('new tree()', tree.root && tree.leaf && tree.count > 0, true);

var count = tree.count;
logtest('tree.count', count, 7);


var names = ds.array.select(tree.toArray(), 'name').join();
logtest('tree.toArray()', names, "leaf1,child1,leaf2,child2,leaf3,child3,root");

