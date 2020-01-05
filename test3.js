const { resolve } = require("path");
const { readdir } = require("fs-extra").promises;
const fs = require("fs-extra");

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
    try {
      fs.copySync(f, "/tmp/testCopyFile");
      console.log("success!");
    } catch (err) {
      console.error(err);
    }
  }
})();
