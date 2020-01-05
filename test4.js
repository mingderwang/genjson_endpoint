require("isomorphic-fetch");
const Promise = require("bluebird");
const encode = require("base-64").encode;
const readdirp = require('readdirp')
const URL = "https://10.99.1.10:9200/_cat/indices";
const username = "admin";
const password = "admin";

let headers = new Headers();
headers.set(
  "Authorization",
  "Basic " + Buffer.from(username + ":" + password).toString("base64")
);
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const read = async (directory) => {
  const stream = readdirp(directory, {type: 'all'});
  let i = 0;
  const start = Date.now();
  for await (const chunk of stream) {
    i++;
    // Check memory usage with this line. It should be 10MB or so.
    // Comment it out if you simply want to list files.
    // await new Promise(resolve => setTimeout(resolve, 500));
    //if (i % 100000 === 0)
    console.log(chunk.fullPath)
    /*
    var numbers = [chunk.path]
    Promise.map(
  numbers,
  number => {
    console.log("start");
    fetch(URL, {
      method: "get",
      headers: new Headers({
        Authorization: "Basic " + encode(username + ":" + password)
      })
    }).then(response => {
      console.log(response.ok);
    });
      },
  { concurrency: 1 }
  )
  */
      console.log(`${i}: ${chunk.path}`);
    }
  console.log('Finished', i, 'files in', Date.now() - start, 'ms');
  // const entries = await readdirp.promise(directory, {alwaysStat: false});
  // console.log('Promise done', entries.length);
};

read('.');

