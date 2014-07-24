name:	ds.oop		
date:	7/22/2014	
author: digital.synapse.software@gmail.com

 Allows OOP concepts in javascript including classes, inheritance, multi-inheritance, polymophism, 
interfaces (code contracts), and enumerators 

Note: 
ds.min.js     - the expanded framework. everything in the project.
ds.oop.min.js - just class creation. the minimal framework 

--- Getting Started ---

Creating a class is simple. Here is the minimal requirements to define a class:

	var MyClass = ds.class({
	    type: 'MyClass',
	    constructor: function () { }
	});

Thats it. just a constructor function and a type string.
To create class member variables just use the this keyword inside of a class function.

	var Color = ds.class({
	    type: 'Color',
	    constructor: function (r,g,b) { 
		this.r = r;                     /* now r,g, and b are available to    */
		this.g = g;                     /* other functions in the Color class */
		this.b = b;                     
	    }
	});
	var red = new Color(255,0,0);   // using the new keyword to instantiate the class

One of the best ways to create reusable code is to use class inheritance.
A class can inherit the methods from any other classes you create.
The is acheived by using the 'inherits' property:

	var a = ds.class({
	    type: 'a',
	    constructor: function (x) { this.x = x; },
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

ds.oop supports single, multiple, multilevel, hybrid, and hierarchical inheritance.
You can also use code contracts using the 'implements' property...

	var IThing= {
		dothing: function( also )
	};
	var Thing = ds.class({
	    type: 'Thing',
	    implements: IThing,
	    constructor: function(){},
	    dothing: function(thing){
		console.log('I am doing ' + thing);
	    }
	};

ds.oop will throw an error to let you know if your class does not implement all of the signatures in the contract.
It will even tell you exactly which signatures are missing.
Multiple inheritance and multiple interfaces are allowed on any class. just use an array instead...

	var Thing = ds.class({
	    type: 'Thing',
	    inherits: [Class1,Class2,Class3]
	    implements: [Interface1,Interface2,Interface3]
	    constructor: function(){},
	    // ...
	};

I hope this helps. For some more examples see classtest.js in the /test folder.