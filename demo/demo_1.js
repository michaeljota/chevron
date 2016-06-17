"use strict";

let cv = new Chevron("demoChevron");

cv.service("myService1", [], function() {
    console.log("myService1 started");
    return 4;
});

cv.service("myService2", ["myService1", "myFactory1"], function(foo) {
    console.log("myService2 started");
    return foo + " + " + this.myFactory1.bar + " + " + this.myService1();
});

cv.factory("myFactory1", ["myService1"], function(foo, bar) {
    console.log("myFactory1 started");
    this.foo = foo + " + " + this.myService1();
    this.bar = bar + " lorem";
    //this.foobar = foo + bar + cv.access("myService1")();
}, [12, 24]);


cv.middleware(function(name) {
    console.log("Middleware fired for " + name);
});



let accessedFn = cv.access("myService2");
console.log(accessedFn);
