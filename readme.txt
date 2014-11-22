name:	ds.oop.min.js		
date:	11/13/2014	
author: digital-synapse

 A very fast class framework. Allows OOP concepts in javascript including classes, inheritance, multi-inheritance, polymophism, interfaces, and enumerators without using TypeScript. Also very small at only 2.02 kb for the minified version. (compare that to prototypejs minified 93.38 kb)

If you like this project send me an email:

    digital.synapse.software [ಠ_ಠ] gmail.com


--- Getting Started ---------------------------------------------------------------

To get started include ds.oop.min.js
Creating a class is simple. Here are the minimal requirements to define a class:

	ds.make.class({
	    type: 'MyClass',              /* The type name - always required */
	});

Thats it. just a type string. To create class member variables just use the this *  keyword inside of a class function. Here is how you define a constructor:

	var Color = ds.make.class({
	    type: 'Color',
	    constructor: function (r,g,b) { 
		this.r = r;                     /* now r,g, and b are available to   */
		this.g = g;                     /* other methods in the Color class  */
		this.b = b;                     
	    }
	});
	var red = new Color(255,0,0);   // using the new keyword to instantiate the class

One of the best ways to create reusable code is to use class inheritance. A class can inherit the methods *  from any other classes you create. The is achieved by using the 'inherits' property which accepts a class *  object or array of class objects as a parameter:

	var a= ds.make.class({
	    type: 'a',
	    constructor: function (x) { this.val = x; },
	    mul: function (s) {
	        this.val *= s;
	        return this;
	    }
	});
	var b= ds.make.class({
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
	var Thing = ds.make.class({
	    type: 'Thing',
	    implements: IThing,
	    constructor: function(){},
	    dothing: function(thing){        /* enforced by contract IThing */
		console.log('I am doing ' + thing);
	    }
	};

ds.oop will throw an error to let you know if your class does not implement all of the signatures in the contract. It will even tell you exactly which signatures are missing. Multiple inheritance and multiple interfaces are allowed on any class. As a general rule whenever there is an conflict with multiple inheritance or multiple interfaces, ds.oop gives priority to the left most class in the list.

	var Thing = ds.make.class({
	    type: 'Thing',
	    inherits: [Class1,Class2,Class3],
	    implements: [Interface1,Interface2,Interface3],
	    constructor: function(){},
	    // ...
	};

Want to organize your classes? Use namespaces! since make.class will automatically create/update a namespace from your type, you don't need to explicitly assign the return value. Just use the created namespace.

	ds.make.class({
	    type: 'Game.World.Entity',           /* added to global scope */
            constructor: function( entityId ) {
                this.entityId = entityId;
            }
        });
        var entity = new Game.World.Entity('paul');
        console.log(entity.entityId);                /* output: paul */


Hopefully you are starting to see how ds.oop can help you write javascript code smarter and faster. For some more examples see classtest.js in the /test folder.

--- Notes -----------------------------------------------------------------

* ds.oop uses future reserved keywords *intentionally* to make the purpose of the code more intuitive and easier to read. The future reserved keywords being used are 'enum', 'implements', and 'class'. Feel free to do a find and replace in ds.oop.min.js if you would prefer to use substitutes for these.

* ds.min.js is the full ds library. It includes several collection classes such as List, Queue, Stack, Dictionary, and Tree as well as some other helper functions and basic polyfills. If you just want the OOP framework use ds.oop.min.js instead. 

If you like this project feel free to send me an email:

    digital.synapse.software [ಠ_ಠ] gmail.com