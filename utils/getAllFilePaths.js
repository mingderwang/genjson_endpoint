"use strict";
const readdirp = require("readdirp");
const postJson = require("./postJson");

// some filters as options of readdirp
const options = {
  fileFilter: ["*", "!*.iso", "!*.zip", "!*.tz"],
  directoryFilter: ["!.git", "!*modules"],
  // directoryFilter: (di) => di.basename.length |=== 9
  type: "files_directories",
  depth: 9
}
const logfile = entry => {
  console.log("-start postJson this file--->", entry.fullPath);
};
const getAllFilePaths = root_path => {
  var allFilePaths = [];
  // Iterate recursively through a folder
  readdirp(root_path, options)
    .on("data", file => {
      allFilePaths.push(file);
      // eslint-disable-next-line no-process-exit
      //      process.exit(1);
    })
    .on("warn", function(warn) {
      console.log("Warn: ", warn);
    })
    .on("error", function(err) {
      console.log("Error: ", err);
    })
    .on("end", function() {
      console.log(allFilePaths);
      // ["c:/file.txt","c:/other-file.txt" ...]
    });
    // return [] <--------- here
  return allFilePaths;
};
module.exports = getAllFilePaths;
