const co = require('co')

co(function *(){
  // yield any promise
  var result = yield Promise.resolve(true);
}).catch(onerror);

const test = co(function *(){
  // resolve multiple promises in parallel
  var a = Promise.resolve(1);
  var res = yield a;
  console.log("1:",res);
  var c = Promise.resolve(res+1);
  var res2 = yield c;
  console.log("2:",res2)
}).catch(onerror);

for (var i = 0; i < 10; i++) {
    console.log("-----i>",i)
    test
}
test

// errors can be try/catched
co(function *(){
  try {
    yield Promise.reject(new Error('boom'));
  } catch (err) {
    console.error(err.message); // "boom"
 }
}).catch(onerror);

function onerror(err) {
  // log any uncaught errors
  // co will not throw any errors you do not handle!!!
  // HANDLE ALL YOUR ERRORS!!!
  console.error(err.stack);
}
