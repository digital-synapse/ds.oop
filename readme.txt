name:	ds.oop		
date:	7/22/2014	
author: digital.synapse.software@gmail.com

 Allows OOP concepts in javascript including classes, inheritance, multi-inheritance, polymophism, interfaces (code contracts), and enumerators 

--- Getting Started -----------------------------------------------------------------
To get started include ds.oop.min.js or ds.oop.js
Creating a class is simple. Here are the minimal requirements to define a class:

	var MyClass = ds.class({
	    type: 'MyClass',              /* The type name */
	    constructor: function () { }  /* The constructor */
	});

Thats it. just a constructor function and a type string. To create class member variables just use the this keyword inside of a class function.

	var Color = ds.class({
	    type: 'Color',
	    constructor: function (r,g,b) { 
		this.r = r;                     /* now r,g, and b are available to   */
		this.g = g;                     /* other methods in the Color class  */
		this.b = b;                     
	    }
	});
	var red = new Color(255,0,0);   // using the new keyword to instantiate the class

One of the best ways to create reusable code is to use class inheritance. A class can inherit the methods from any other classes you create. The is achieved by using the 'inherits' property which accepts a class object or array of class objects as a parameter:

	var a= ds.class({
	    type: 'a',
	    constructor: function (x) { this.val = x; },
	    mul: function (s) {
	        this.val *= s;
	        return this;
	    }
	});
	var b= ds.class({
	    type: 'b',
	    inherits: a,              
	    constructor: function (x) { this.val = x; },
	    sub: function (s) {
	        this.val -= s;
	        return this;
	    }
	});
	var o = new b(5);
	var output = o.mul(3).sub(5).val;    // output = 10

ds.oop supports single, multiple, multilevel, hybrid, and hierarchical inheritance.  
You can also use code contracts using the 'implements' property...

	var IThing= {
		dothing: function(thing) {}  /* this is an interface signature */
	};
	var Thing = ds.class({
	    type: 'Thing',
	    implements: IThing,
	    constructor: function(){},
	    dothing: function(thing){        /* enforced by contract IThing */
		console.log('I am doing ' + thing);
	    }
	};

ds.oop will throw an error to let you know if your class does not implement all of the signatures in the contract. It will even tell you exactly which signatures are missing. Multiple inheritance and multiple interfaces are allowed on any class. As a general rule whenever there is an conflict with multiple inheritance or multiple interfaces, ds.oop gives priority to the left most class in the list.

	var Thing = ds.class({
	    type: 'Thing',
	    inherits: [Class1,Class2,Class3]
	    implements: [Interface1,Interface2,Interface3]
	    constructor: function(){},
	    // ...
	};

Hopefully you are starting to see how ds.oop can help you write javascript code smarter and faster. For some more examples see classtest.js in the /test folder.

If you like this project send me an email:

digital.synapse.software [ಠ_ಠ]  gmail.com