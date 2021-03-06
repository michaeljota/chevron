# ChevronJS

> A super tiny TypeScript library for dependency injection.

## Introduction

Chevron is an extremely small(~600Bytes) JavaScript library for dependency injection inspired by [BottleJS](https://github.com/young-steveo/bottlejs), and the [AngularJS Module API](https://docs.angularjs.org/api/ng/type/angular.Module).

[Demo](http://codepen.io/FelixRilling/pen/AXgydJ)

[Docs](https://felixrilling.github.io/chevron/)

## Usage

```shell
npm install chevronjs
```

### Constructor

To start with Chevron, you need to create a new Chevron container:

```typescript
import {Chevron} from "chevronjs";

const cv = new Chevron();
```

### Dependency Types

Chevron comes with two built-in types.

#### Services

Services are the most common type of dependencies. A service is simply a function wrapped by Chevron to inject dependencies.
The syntax for `service` is as follows:

```typescript
import {Chevron} from "chevronjs";

const cv = new Chevron();

// Create new service
cv.set("myService", "service", [], function() {
    return 12;
});
// Get service from the Chevron Container
const myService = cv.get("myService");
myService(); // => 12
```

With dependencies:

```typescript
import {Chevron} from "chevronjs";

const cv = new Chevron();

cv.set("myService", "service", [], function() {
    return 12;
});

// Declare the service "foo" as dependency and as function argument
cv.set("myOtherService", "service", ["myService"], function(myService, int) {
    return int * myService();
});

const myOtherService = cv.get("myOtherService");
myOtherService(2); // => 24
```

#### Factories

Factories are very similar to services but are treated as **constructors** instead of functions.
Factories can be called with the `factory` method.

```typescript
import {Chevron} from "chevronjs";

const cv = new Chevron();

// Create new factory
cv.set("myFactory", "factory", [], function() {
    this.foo = 12;
    this.bar = 17;
});

const myFactory = cv.get("myFactory");
myFactory.bar; // => 17
```

Combined with a service:

```typescript
import {Chevron} from "chevronjs";

const cv = new Chevron();

cv.set("myFactory", "factory", [], function() {
    this.foo = 7;
    this.bar = 17;
});

cv.set("myService", "service", ["myFactory"], function(myFactory, int) {
    return int * myFactory.foo;
});

const myService = cv.get("myService");
myService(3); // => 21
```

## API

You can easily create your own type by using the Chevron API.
To declare a new type, simply call add a typeName and constructorFunction for your new type on the type map of a chevron instance:

```typescript
import {Chevron} from "chevronjs";

const cv = new Chevron();

cv.$.set("myType", function(content, dependencies) {
    console.log("Hello World");

    return content;
});
```

You'll probably want to start by using a modified version of the default Service or Factory constructorFunction.
After you created the new type, you can use it when setting a new entry:

```typescript
import {Chevron} from "chevronjs";

const cv = new Chevron();

cv.set("myTypeModule", "myType", [], function() {
    return "bar";
});
```
