
function run( gen) {
  var iter = gen( msg => iter.next( msg));

  iter.next();
}

run(function* (resume) {
  console.log("before");
  console.log(yield setTimeout(() => resume( "hello"), 1000));
  console.log(yield setTimeout(() => resume( "world"), 1000));
  console.log("after");
});

