/// <reference path="/@JSense.js" />
var ds = ds || {};
ds.interfaces = ds.interfaces || {};
ds.data = ds.data || {};

ds.interfaces.enumerable = {
    toArray: function () { },
    iterate: function (callback) { }/*,
    count: function () { }*/
};

ds.interfaces.collection = {
    empty: function () {},
    at: function(key) {},
    removeAt: function(key) {},
    remove: function(item) {}
};

ds.interfaces.queue = {
    peek: function() {}
};

ds.data.enumerable = ds.make.class({
    type: 'Enumerable',
    constructor: function () {
    },
    enumerable: function () {
        this.__defineGetter__("count", function () {
            return this.length;
        });
    },
    toArray: function () {
        var data = [];
        this.iterate(function (item) {
            data.push(item);
        });
        return data;
    }/*,
    count: function () {        
        return this.length;
    }*/
});

ds.data.dictionary = ds.make.class({
    type: 'Dictionary',
    implements: [ds.interfaces.enumerable, ds.interfaces.collection],
    inherits: ds.data.enumerable,
    constructor: function (object) {
        this.enumerable();
        this.empty();

        if (object) {
            var keys = Object.keys(object);
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var value = object[key];
                this.add(key, value);
            }
        }
    },
    empty: function () {
        this.length = 0;
        this.collection = {};
    },    
    add: function (key, item) {
        this.collection[key] = item;
        return ++this.length;
    },
    at: function (key) {
        return this.collection[key];
    },
    removeAt: function (key) {
        if (!this.collection[key])
            return undefined;
        delete this.collection[key]
        return --this.length
    },
    iterate: function (callback) {
        var keys = this.keys();
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var value = callback(this.collection[key], key);
            if (value) return value;
        }
    },
    keys: function () {
        return Object.keys(this.collection);
    },
    remove: function (item) {
        var keys = this.keys();
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var value = this.collection[key];
            if (ds.object.isEqual(value, item)) {
                return this.removeAt(key);
            }
        }
    }
});

// class list: used to create a doubly linked list
ds.data.list = ds.make.class({
    type: 'List',
    implements: [ds.interfaces.enumerable, ds.interfaces.collection],
    inherits: ds.data.enumerable,
    constructor: function () {
        this.enumerable();
        this.empty();
        this.addMany.apply(this, arguments); // pass *arguments* through to addmany funciton
    },

    empty: function () {
        this.length = 0;
        this.firstnode = null;
        this.lastnode = null;
    },

    // easy way to iterate the collection - bool callback(data, index)
    iterate: function (callback) {
        if (this.length > 0) {
            var node = this.firstnode;
            var i = 0;
            while (node) {
                if (callback(node.data, i)) break;
                i++;
                node = node.nextnode;
            }
        }
    },

    addMany: function () {
        if (arguments) {
            for (var i = 0; i < arguments.length; i++) {
                this.add(arguments[i]);
            }
        }
    },

    // adds a new item to the end of the list
    add: function (data) {
        var node = {};
        if (this.lastnode)
            this.lastnode.nextnode = node;

        node.prevnode = this.lastnode;
        node.nextnode = null;
        node.data = data;

        if (!this.firstnode)
            this.firstnode = node;

        this.lastnode = node;
        this.length++;
    },

    addAt: function (data, index) {
        if (index >= 0) {

            if (index >= this.length-1) {
                this.add(data);
                return;
            }
            var node = this.firstnode;
            var i = 0;
            while (node) {
                if (i == index) {
                    var nextnode = node;
                    node = { data: data };
                    node.nextnode = nextnode;
                    node.prevnode = nextnode.prevnode;
                    if (node.prevnode)
                        node.prevnode.nextnode = node;
                    else
                        this.firstnode = node;
                    nextnode.prevnode = node;
                    this.length++;
                    return;
                }
                i++;
                node = node.nextnode;
            }
        }

    },

    // returns an item at the given index
    at: function (index) {
        if (index >= 0 && index < this.length) {
            var node = this.firstnode;
            var i = 0;
            while (node) {
                if (i == index) return node.data;
                i++;
                node = node.nextnode;
            }
        }
    },

    first: function () {
        return this.firstnode ? this.firstnode.data : null;
    },

    last: function () {
        return this.lastnode ? this.lastnode.data : null;
    },

    removeFirst: function () {
        if (this.firstnode) {
            if (this.firstnode.nextnode) {
                var node = this.firstnode.nextnode;
                node.prevnode = null;
                this.firstnode = node;
                this.length--;
            }
        }
    },
    removeLast: function () {
        if (this.lastnode) {
            if (this.lastnode.prevnode) {
                var node = this.lastnode.prevnode;
                node.nextnode = null;
                this.lastnode = node;
                this.length--;
            }
        }
    },

    // removes an item at the given index
    removeAt: function (index) {
        if (index >= 0 && index < this.length) {
            var node = this.firstnode;
            var i = 0;
            while (node) {
                if (i == index) {
                    if (node.prevnode) {
                        node.prevnode.nextnode = node.nextnode;
                    }
                    else
                        this.removeFirst();

                    if (node.nextnode) {
                        node.nextnode.prevnode = node.prevnode;
                    }
                    else
                        this.removeLast();

                    return;
                }
                i++;
                node = node.nextnode;
            }
        }
    },

    // removes an item, returns false if the item was not found
    remove: function (item) {
        if (this.length > 0) {
            var node = this.firstnode;
            var i = 0;
            while (node) {
                if (ds.object.isEqual(node.data, item)) {
                    if (node.prevnode) {
                        node.prevnode.nextnode = node.nextnode;
                    }
                    else
                        this.removeFirst();

                    if (node.nextnode) {
                        node.nextnode.prevnode = node.prevnode;
                    }
                    else
                        this.removeLast();
                    
                    return i;
                }
                i++;
                node = node.nextnode;
            }
        }
        return false;
    },

    // returns an items index in the collection
    indexOf: function (item) {
        if (this.length > 0) {
            var node = this.firstnode;
            var i = 0;
            while (node) {
                if (ds.object.isEqual(node.data, item)) {
                    return i;
                }
                i++;
                node = node.nextnode;
            }
        }
    }
});

// implements stack LIFO
ds.data.stack= ds.make.class({
    type: 'Stack',
    implements:  ds.interfaces.queue,
    inherits: [ds.data.enumerable, ds.data.list],
    constructor: function () {
        this.enumerable();
        this.empty();
        this.addMany.apply(this,arguments); // pass *arguments* through to addmany funciton    
    },

    push: function( item ){
        return this.add(item);
    },
    pop: function() {
        var node = this.lastnode.data;
        this.removeLast();
        return node;
    },
    peek: function() {
        var node = this.lastnode.data;
        return node;
    }
});

// implements queue FIFO
ds.data.queue = ds.make.class({
    type: 'Queue',
    implements: ds.interfaces.queue,
    inherits: [ds.data.enumerable, ds.data.list],
    constructor: function () {
        this.enumerable();
        this.empty();
        this.addMany.apply(this, arguments); // pass *arguments* through to addmany funciton    
    },

    enqueue: function (item) {
        return this.add(item);
    },
    dequeue: function () {
        var node = this.firstnode.data;
        this.removeFirst();
        return node;
    },
    peek: function () {
        var node = this.firstnode.data;
        return node;
    }
});

/// class tree : used to create a complete tree from a hierarcical object
/// adds parents to all nodes and an array of leaf nodes for easy reverse traversal
/// also works directly with forx (note: forx does not require tree objects since forx works with any object type)
ds.data.tree = ds.make.class({
    type: 'Tree',
    implements: ds.interfaces.enumerable,
    inherits: ds.data.enumerable,
    constructor: function (object) {
        this.enumerable();
        this.root = object;
        this.leaf = [];
        var length = 0;
        var leaf = this.leaf;
        ds.forx(object, function (obj, lvl, parent, isLeaf) {
            obj.parent = parent;
            obj.isLeaf = isLeaf;
            if (isLeaf) leaf.push(obj);
            length++;
        }, false);
        this.length = length;

        // find an array so we know the name of the child        
        var keys = Object.keys(this.root);
        for (var i = 0; i < keys.length; i++) {
            ds.type
            if (ds.isArray(this.root[keys[i]])) {
                this.recurseOn = keys[i];
                break;
            }
        }
    },
    toArray: function () {
        var array = [];
        ds.forx(this.root, function (obj) {
            array.push(obj);
        }, this.recurseOn);
        return array;
    },
    iterate: function (callback) {
        ds.forx(this.root, callback, this.recurseOn);
    }
});