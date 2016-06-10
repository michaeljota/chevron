"use strict";

let cv = new Chevron();

cv.service("myService1", [], function () {
    console.log("myService1 initialized");
    return 12;
});

cv.service("myService2", ["myService1"], function (foo) {
    cv.access("myService1")();
    console.log("myService2 initialized");
    return foo;
});

cv.factory("myFactory1", ["myService1"], function (foo, bar) {
    this.sv1 = cv.access("myService1")(bar);
    this.val1 = foo;
    this.val2 = bar;
}, [12, 24]);

cv.service("myService3", ["myService1", "myService2", "myFactory1"], function (foo, bar) {
    let ac = cv.access("myService2")(foo);
    console.log("myService3 initialized");
    console.log(this.myFactory1.val1 + bar);
    return ac;
});


let result = cv.access("myService3")(5, 4);
