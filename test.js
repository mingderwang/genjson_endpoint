function * generatorFunction() { // Line 1
  console.log('This will be executed first.');
  yield 'Hello, ';   // Line 2
  console.log('I will be printed after the pause');
  yield 'World!';
}
const generatorObject = generatorFunction(); // Line 3
var status = generatorObject.next().value
while(status) {
   console.log(status)
 status = generatorObject.next().value
}
console.log("the end")
// This will be executed first.
// Hello,
// I will be printed after the pause
// World!
// undefined
