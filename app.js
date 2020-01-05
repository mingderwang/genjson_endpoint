require("isomorphic-fetch");
const Promise = require("bluebird");
import { encode } from "base-64";
const getAllFilePaths = require("./utils/getAllFilePaths");

if (process.argv.length <= 2) {
  console.log("Usage: " + __filename + " path/to");
  process.exit(-1);
}
var root_path = process.argv[2];

const numbers = [];
for (var i = 0; i < 10; i++) {
  //numbers.push(i);
}

const URL = "https://10.99.1.10:9200/_cat/indices";
const username = "admin";
const password = "admin";

let headers = new Headers();
headers.set(
  "Authorization",
  "Basic " + Buffer.from(username + ":" + password).toString("base64")
);

var arr = getAllFilePaths(root_path);
if (Array.isArray(arr)) {
    console.log("---------",arr.length)
} else {

    console.log("-akk--------",arr)
}
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const results = Promise.map(
  numbers,
  number => {
    console.log("start", number);
    fetch(URL, {
      method: "get",
      headers: new Headers({
        Authorization: "Basic " + encode(username + ":" + password)
      })
    }).then(response => {
      console.log(response.ok);
    });
    console.log("start2", number);
    return fetch(URL, {
      method: "get",
      headers: new Headers({
        Authorization: "Basic " + encode(username + ":" + password)
      })
    }).then(response => {
      console.log(response.ok);
    });
  },
  { concurrency: 1 }
);
console.log("results:", results);
