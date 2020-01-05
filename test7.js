var req = require("request");
const fetch = require("isomorphic-fetch");
const Promise = require("bluebird");
var sync = require("sync-request");
const encode = require("base-64").encode;
const readdirp = require("readdirp");
const URL = "https://10.99.1.10:9200/_cat/indices";
const username = "admin";
const password = "admin";

let headers = new Headers();
headers.set(
  "Authorization",
  "Basic " + Buffer.from(username + ":" + password).toString("base64")
);

// Load example.com N times (yes, it's a real website):
var N = 10;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

(async () => {
  console.log("BLOCKING test ==========");
  var start = new Date().valueOf();
  for (var i = 0; i < N; i++) {
    console.log(i);
    const results = await Promise.map(
      ["test"],
      number =>
        fetch(URL, {
          method: "get",
          headers: new Headers({
            Authorization: "Basic " + encode(username + ":" + password)
          })
        }).then(res => console.log(res)),
      { concurrency: 1 }
    );
  }
  var end = new Date().valueOf();
  console.log("Total time: " + (end - start) + "ms");
})();
