const { resolve } = require("path");
const co = require("co");
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

const isWindows = true;

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
  for await (const f of getFiles("./utils/test")) {
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
//		 console.log(res);
		  var accessJson = JSON.parse(res)
            console.log("1JSON:", accessJson);
		  member['uid']=accessJson.Owner
		  member['gid']=accessJson.Group
		  member['access']=accessJson.AccessToString
		  member['windowsInfo']=accessJson
         console.log("1:",member);
            var c = fetch(URL, {
              method: "post",
              body: JSON.stringify(member),
              headers: new Headers({
                "Content-Type": "application/json",
                Authorization: "Basic " + encode(username + ":" + password)
              })
            });
            var res2 = yield c;
            console.log("2:", res2);
          });
        },
        { concurrency: 1 }
      );

      console.log("success!");
    } catch (err) {
      console.error(err);
    }
  }
})();

var isMomHappy = true;

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
//	  console.log("===== file path ====",stats.file_path)
    ps.addCommand("./getFileAcl.ps1", [
      {
        name: "filePath",
        value: stats.file_path
      }
    ])
    return ps.invoke().then(
	    function(res) {
//		    console.log("======= invoke.then =====",res)
		    ps.dispose();
		    console.log("======= ps.dispose =====",res)
		    return res
	    }
    )
  .catch(function(err){
      console.log(err);
      ps.dispose();
  });
  } else {
    console.log("---- windows ps1 return: ", stats.file_path);
    var phone = {
	    Owner:"ming",
	    Group:"rd",
	    AccessToString:"me"
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
