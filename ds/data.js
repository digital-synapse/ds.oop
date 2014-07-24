/// <reference path="/@JSense.js" />
var ds;if(!ds)ds={};
if (!ds.interfaces) ds.interfaces = {};
if (!ds.data) ds.data = {};

ds.interfaces.enumerable = {
    toArray: function() {},
    iterate: function (callback) { }
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
    constructor: function(){},
    toArray: function () {
        var data = [];
        this.iterate(function (item) {
            data.push(item);
        });
        return data;
    }
});

ds.data.dictionary = ds.make.class({
    type: 'Dictionary',
    implements: [ds.interfaces.enumerable, ds.interfaces.collection],
    inherits: ds.data.enumerable,
    constructor: function ( object ) {
        this.empty()

        if (object) {            
            var keys = Object.keys(object);
            for (var i=0; i<keys.length; i++){
                var key=keys[i];
                var value = object[key]; 
                this.add(key,value);
            }            
        }        
    },
    empty: function () {
        this.count = 0;
        this.collection = {};
    },
    add: function(key, item) {
        this.collection[key]=item;
        return ++this.count;
    },
    at: function(key) {     
        return this.collection[key];
    },
    removeAt: function(key) {
        if(this.collection[key]==undefined)
                       return undefined;
        delete this.collection[key]
        return --this.count    
    },
    iterate: function(callback){
        var keys = this.keys();
        for (var i=0; i<keys.length; i++){
            var key=keys[i];
            var value = callback(this.collection[key],key); 
            if (value) return value;
        }
    },
    keys: function() {
        return Object.keys(this.collection);
    },
    remove: function(item){
        var keys = this.keys();
        for (var i=0; i<keys.length; i++){
            var key=keys[i];
            var value = this.collection[key]; 
            if (ds.object.isEqual(value,item)){
                return this.removeAt(key);
            }
        }
    }
});

// class list: used to create a doubly linked list
ds.data.list= ds.make.class({
        type: 'List',
        implements: [ds.interfaces.enumerable, ds.interfaces.collection],
        inherits: ds.data.enumerable,
        constructor: function () {
            this.empty();
            this.addMany.apply(this,arguments); // pass *arguments* through to addmany funciton
        },

        empty: function () {
            this.count = 0;
            this.firstnode = null;
            this.lastnode = null;
        },

        // easy way to iterate the collection - bool callback(data, index)
        iterate: function (callback) {
            if (this.count > 0) {
                var node = this.firstnode;
                var i = 0;
                while (node != null) {
                    if (callback(node.data, i)) break;
                    i++;
                    node = node.nextnode;
                }
            }
        },

        addMany: function() {
            if (arguments) {
                for (var i = 0; i < arguments.length; i++) {
                    this.add(arguments[i]);
                }
            }
        },

        // adds a new item to the end of the list
        add: function (data) {
            var node = {};
            if (this.lastnode != null)
                this.lastnode.nextnode = node;

            node.prevnode = this.lastnode;
            node.nextnode = null;
            node.data = data;

            if (this.firstnode == null)
                this.firstnode = node;

            this.lastnode = node;
            this.count++;
        },

        addAt: function (data, index) {
            if (index >= 0) {

                if (index >= this.count) {
                    this.add(data);
                    return;
                }
                var node = this.firstnode;
                var i = 0;
                while (node != null) {
                    if (i == index) {
                        var nextnode = node;
                        var node = { data: data };
                        node.nextnode = nextnode;
                        node.prevnode = nextnode.prevnode;
                        if (node.prevnode)
                            node.prevnode.nextnode = node;
                        else
                            this.firstnode = node;
                        nextnode.prevnode = node;
                        this.count++;
                        return;
                    }
                    i++;
                    node = node.nextnode;
                }
            }

        },

        // returns an item at the given index
        at: function (index) {
            if (index >= 0 && index < this.count) {
                var node = this.firstnode;
                var i = 0;
                while (node != null) {
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
                }
            }
        },
        removeLast: function () {
            if (this.lastnode) {
                if (this.lastnode.prevnode) {
                    var node = this.lastnode.prevnode;
                    node.nextnode = null;
                    this.lastnode = node;
                }
            }
        },

        // removes an item at the given index
        removeAt: function (index) {
            if (index >= 0 && index < this.count) {
                var node = this.firstnode;
                var i = 0;
                while (node != null) {
                    if (i == index) {
                        if (node.prevnode)
                            node.prevnode.nextnode = node.nextnode;
                        else
                            this.removeFirst();
                        if (node.nextnode)
                            node.nextnode.prevnode = node.prevnode;
                        else
                            this.removeLast();
                        this.count--;
                        return;
                    }
                    i++;
                    node = node.nextnode;
                }
            }
        },

        // removes an item, returns false if the item was not found
        remove: function (item) {
            if (this.count > 0) {
                var node = this.firstnode;
                var i = 0;
                while (node != null) {
                    if (ds.object.isEqual(node.data, item)) {
                        if (node.prevnode)
                            node.prevnode.nextnode = node.nextnode;
                        else
                            this.removeFirst();
                        if (node.nextnode)
                            node.nextnode.prevnode = node.prevnode;
                        else
                            this.removeLast();
                        this.count--;
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
            if (this.count > 0) {
                var node = this.firstnode;
                var i = 0;
                while (node != null) {
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
ds.data.queue= ds.make.class({
    type: 'Queue',
    implements: ds.interfaces.queue,
    inherits: [ds.data.enumerable, ds.data.list],
    constructor: function () {
        this.empty();
        this.addMany.apply(this,arguments); // pass *arguments* through to addmany funciton    
    },

    enqueue: function( item ){
        return this.add(item);
    },
    dequeue: function() {
        var node = this.firstnode.data;
        this.removeFirst();
        return node;
    },
    peek: function() {
        var node = this.firstnode.data;
        return node;
    }
});