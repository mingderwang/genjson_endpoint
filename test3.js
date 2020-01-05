const { resolve } = require("path");
var shell = require("node-powershell");
const { readdir } = require("fs-extra").promises;
const fs = require("fs-extra");
const Promise = require("bluebird");
const encode = require("base-64").encode;
const fetch = require("isomorphic-fetch");
const fileInfo = require("./utils/fileAttributes");
const URL = "https://10.99.1.10:9200/win_index/_doc/?pipeline=attachment";
const username = "admin";
const password = "admin";

const isWindows = false;

let headers = new Headers();
headers.set(
  "Authorization",
  "Basic " + Buffer.from(username + ":" + password).toString("base64")
);
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
async function* getFiles(dir) {
  const stat = await fs.lstat(dir);
    console.log("isFile:",stat.isFile(), dir);
    if (stat.isFile()) {
      yield dir
    }
  const dirents = await readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    console.log("dir:", dir);
    console.log("dirent:", dirent);
    const res = resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFiles(res);
    } else {
      yield res;
    }
  }
}

if (isWindows) {
  var ps = new shell({
    executionPolicy: "bypass",
    noProfile: true
  });
}

(async () => {
  for await (const f of getFiles("./utils/test/post.js")) {
    console.log(f);
    let stats = fileInfo(f);
    console.log(stats);
    console.log("------- fileInfo, return size:", stats.size);

    if (stats == null) {
      console.log("------- directory, return");
    }
    stats["windowsInfo"] = ps1(f);
    try {
      const results = await Promise.map(
        ["nothing_here"],
        number =>
          fetch(URL, {
            method: "post",
            body: JSON.stringify(stats),
            headers: new Headers({
              "Content-Type": "application/json",
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

const ps1 = filePath => {
  if (isWindows) {
    ps.addCommand("./getFileAcl.ps1", [
      {
        name: "filePath",
        value: filePath
      }
    ]);
    ps.invoke().then(output => {
      console.log(output);
    });
  } else {
    console.log("---- windows ps1 return: ", filePath);
  }
};
