const { resolve } = require("path");
const { readdir } = require("fs-extra").promises;
const fs = require("fs-extra");
const Promise = require("bluebird");
const encode = require("base-64").encode;
const readdirp = require("readdirp");
const fetch = require("isomorphic-fetch");
const fileInfo = require("./utils/fileAttributes");
const URL = "https://10.99.1.10:9200/win_index/_doc/?pipeline=attachment";
const username = "admin";
const password = "admin";

let headers = new Headers();
headers.set(
  "Authorization",
  "Basic " + Buffer.from(username + ":" + password).toString("base64")
);
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
async function* getFiles(dir) {
  const dirents = await readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFiles(res);
    } else {
      yield res;
    }
  }
}

(async () => {
  for await (const f of getFiles("/Users/mingderwang/src")) {
    console.log(f);
    let stats = fileInfo(f);
    console.log(stats);
    console.log("------- fileInfo, return size:", stats.size);

    if (stats == null) {
      console.log("------- directory, return");
    }
    try {
      const results = await Promise.map(
        ["test"],
        number =>
          fetch(URL, {
            method: "post",
            body: JSON.stringify(stats),
            headers: new Headers({
              'Content-Type': 'application/json',
              Authorization: "Basic " + encode(username + ":" + password)
            })
          }).then(res => console.log(res)),
        { concurrency: 1 }
      );

      console.log("success!");
    } catch (err) {
      console.error(err);
    }
  }
})();
