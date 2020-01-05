const Promise = require("bluebird");
const es = require("event-stream");
const fs = require("fs");
const readdirp = require("readdirp");
const items = ["A", Promise.delay(8000, "B"), Promise.reject("C"), "D"];

function logMem(i) {
  const vals = Object.entries(process.memoryUsage()).map(([k, v]) => {
    return `${k}=${`${(v / 1e6).toFixed(1)}M`.padEnd(7)}`;
  });
  console.log(String(i).padStart(6), ...vals);

  es.mapSync(items, function write(items) {
    Promis.each(items, function(item) {
      return Promise.delay(4000).then(function() {
        console.log("On iterator: " + item);
      });
    })
      .then(function(result) {
        // This not run
      })
      .catch(function(rejection) {
        console.log("Catch: " + rejection);
      });
  });
}

const read = async directory => {
  const stream = readdirp(directory, { type: "all" });
  let i = 0;
  const start = Date.now();
  let lap = 0;

  for await (const chunk of stream) {
    if (i % 1000 === 0) {
      const now = Date.now();
      if (now - lap > 500) {
        lap = now;
        logMem(i);
      }
    }
    i++;
  }
  logMem(i);

  console.log(`Processed ${i} files in ${Date.now() - start} msecs`);
};

read(".");
