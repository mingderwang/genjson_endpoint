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
  console.log("isFile:", stat.isFile(), dir);
  if (stat.isFile()) {
    yield dir;
  } else {
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
}

if (isWindows) {
  var ps = new shell({
    executionPolicy: "bypass",
    noProfile: true
  });
}

(async () => {
  for await (const f of getFiles("./utils")) {
    console.log(f);
    let stats = fileInfo(f);

    if (stats == null) {
      console.log("------- directory, return");
    }
    try {
      const results = await Promise.map(
        [stats],
        member => {
          console.log(member)
          ps1(member.file_path).then (console.log)
          /*
          fetch(URL, {
            method: "post",
            body: JSON.stringify(member),
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: "Basic " + encode(username + ":" + password)
            })
          }).then(res => console.log("done-fetch"));
          */
        },
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
    let pos = ps.invoke()
   // .then(output => {
    //  console.log(output);
   // }
    //);
    return pos;
  } else {
    console.log("---- windows ps1 return: ", filePath);
    return new Promise()
  }
};
