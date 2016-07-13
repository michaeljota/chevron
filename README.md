![ChevronJS](/chevron-logo.png)

# Chevron.js

> An extremely small JavaScript service/dependency library

## Introduction

Chevron is a extremely small JavaScript service library for easy dependency managment inspired by [BottleJS](https://github.com/young-steveo/bottlejs) and the [AngularJS Module API](https://docs.angularjs.org/api/ng/type/angular.Module).

Chevron comes in two forms: normal and lite.

- Normal has all features.
- Lite has the base features excluding decorator/middleware support, but is even smaller than normal

## Syntax

### Constructor

To do anything with Chevron, you need to create a new Chevron Container:

```javascript
var cv = new Chevron();
```

### Services

Services are the bread and butter of Chevron, being the most common way to declare a new component.

```javascript

//Chevron.prototype.service(name,[dependencies],content);
cv.service("foo",[],
  function(){
      return 12;
  }
);

var foo = cv.access("foo");
foo();//returns 12
```

or with dependencies

```javascript

cv.service("foo",[],
  function(){
      return 12;
  }
);

cv.service("bar",["foo"],
  function(foo, int){
      return int * foo();
  }
);

var bar = cv.access("bar");
bar(2);//returns 24
```

### Factories

Factories are like Services but are treated as Constructors instead of classic functions.

```javascript
//Chevron.prototype.factory(name,[dependencies],Constructor,[arguments]);
cv.factory("foo",[],
  function(int){
      this.foo = int;
      this.bar = 17;
  },
  [7]
);

var foo = cv.access("foo");
foo.bar;//returns 17
```

or combined with a service

```javascript
cv.factory("foo",[],
  function(int){
      this.foo = int;
      this.bar = 17;
  },
  [7]
);

cv.service("bar",["foo"],
  function(foo, int){
      return int * foo.foo;
  }
);

var bar = cv.access("bar");
bar(3);//returns 21
```

### Accessing services

Services and Factories can be accessed in two ways:

```javascript
cv.access("foo"); //returns the service with dependencies injected into arguments
```

or, if you just want the service without dependencies:

```javascript
cv.container.foo; //returns the service as Chevron object.
```

## Middleware and Decorators

_Middleware/Decorators are excluded in the lite version_

### Middleware

Middleware can be used to inject a function into a service, causing the service to call the middleware every time the service is called

```javascript
//Chevron.prototype.middleware(fn,[services]);
cv.middleware(
    function(){
        console.log("myCustomService is being run!")
    },
    ["myCustomService"]
);

//Or inject into all services
cv.middleware(
    function(name, foo, bar){
        console.log(name + " was called")
    }
);
```

### Decorator

Decorators are run before initializing the service, returning a modified version of it.

```javascript
//Chevron.prototype.decorator(fn,[services]);
cv.decorator(
    function(service){
      service = function() {
          this.foo = 10;
          this.bar = 4;
      };
      return service;
    },
    ["myCustomService"]
);
```

## Options

The Chevron Constructor can be called with options

```javascript
//Chevron.prototype.service(name = "Chevron");
var namedCv = new Chevron("myCustomContainer");
```
