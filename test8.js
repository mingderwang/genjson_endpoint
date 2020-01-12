const { resolve } = require("path");
const crypto = require("crypto");
const { Sema } = require("async-sema");
const co = require("co");
var shell = require("node-powershell");
const { readdir } = require("fs-extra").promises;
const fs = require("fs-extra");
const Promise = require("bluebird");
const encode = require("base-64").encode;
const fetch = require("isomorphic-fetch");
const fileInfo = require("./utils/fileAttributes");
var URL = "https://10.99.1.10:9200/";
const username = "admin";
const password = "admin";
var count = 0;
const isWindows = true;
const s = new Sema(
  1 // Allow 1 concurrent async calls
);

if (process.argv.length <= 3) {
  console.log(
    "Usage: node " +
      __filename +
      ' "c:\\Users\\ttt\\ming\\src" https://<ELK ip>:9200'
  );
  process.exit(-1);
}
var root_path = process.argv[2];
var elk_url = process.argv[3];
if (elk_url) {
  URL = elk_url + "/";
}

let headers = new Headers();
headers.set(
  "Authorization",
  "Basic " + Buffer.from(username + ":" + password).toString("base64")
);
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
async function* getFiles(dir) {
  console.log("---->", dir);
  await s.acquire();
  const stat = await fs.lstat(dir);
  console.log("isFile:", stat.isFile(), dir);
  yield dir;
  const dirents = await readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFiles(res);
    } else {
      await s.acquire();
      yield res;
    }
  }
}

(async () => {
  for await (const f of getFiles(root_path)) {
    //console.log(f)
    let stats = fileInfo(f);

    if (stats == null) {
      // console.log("------- directory, return");
    }
    try {
      const results = await Promise.map(
        [stats],
        member => {
          co(function*() {
            // resolve multiple promises in parallel
            var a = ps1(member);
            var res = yield a;
            var res2 = {}

            if (isWindows) {
              var hash = crypto
                .createHash("md5")
                .update(res.file_path)
                .digest("hex");
              console.log(hash);
var data = JSON.stringify(res)
              console.log(count, "<=total, after yield a res:", res.file_path);
            res = `{"index": { "_index": "win_index_id", "_type": "_doc", "_id": "`+hash+`", "pipeline": "attachment" } }` + "\n" +
             data + "\n"
             console.log(res)

            } else {
              var hash = "asdfasdfasdf"
            res = `{"index": { "_index": "win_index_id", "_type": "_doc", "_id": "`+hash+`", "pipeline": "attachment" } }` + "\n" +
             `{ "data": "Y291Y291", "name": "jean", "age": 22 }` + "\n"
             console.log(res)
          }

            var c = fetch(URL + "/_bulk", {
              method: "post",
              body: res,
              headers: new Headers({
                "Content-Type": "application/json",
                Authorization: "Basic " + encode(username + ":" + password)
              })
            })
              .then(function(response) {
                return response.json();
              })
              .then(function(myJson) {
                console.log(myJson);
              })
              .then(() => {
                console.log("------------------------ s.release");
                s.release();
              });
            var ii = yield c;
          });
        },
        { concurrency: 1 }
      );

      console.log("success!", count++);
    } catch (err) {
      console.error(err);
    }
  }
})();

var showOff = function(phone) {
  return new Promise(function(resolve, reject) {
    var message =
      "Hey friend, I have a new " +
      phone.color +
      " " +
      phone.brand +
      " phone" +
      phone.type;

    resolve(JSON.stringify(phone));
  });
};

const ps1 = stats => {
  if (isWindows) {
    var ps = new shell({
      executionPolicy: "bypass",
      noProfile: true
    });
    console.log("===== ps1 file path ====", stats.file_path);
    ps.addCommand("./getFileAcl.ps1", [
      {
        name: "filePath",
        value: stats.file_path
      }
    ]);
    return ps
      .invoke()
      .then(function(res) {
        //  console.log("=start====== invoke.then =====",res)
        //  console.log("=end====== invoke.then =====")

        var accessJson = JSON.parse(res);
        // console.log("1JSON:", accessJson);
        stats["uid"] = accessJson.Owner;
        stats["gid"] = accessJson.Group;
        stats["access"] = accessJson.AccessToString;
        stats["windowsInfo"] = accessJson;

        //  console.log("1:",stats);
        ps.dispose();
        //	    console.log("======= ps.dispose =====")
        return stats;
      })
      .catch(function(err) {
        console.log(err);
        ps.dispose();
      });
  } else {
    console.log("---- windows ps1 return: ", stats.file_path);
    var phone = {
      Owner: "ming",
      Group: "rd",
      AccessToString: "me"
    };
    return showOff(phone);
  }
};

// errors can be try/catched
co(function*() {
  try {
    yield Promise.reject(new Error("boom"));
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

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

s.release();
