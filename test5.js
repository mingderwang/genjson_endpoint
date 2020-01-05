"use strict";
require("isomorphic-fetch");
const Promise = require("bluebird");
const encode = require("base-64").encode;
const readdirp = require("readdirp");
const URL = "https://10.99.1.10:9200/_cat/indices";
const username = "admin";
const password = "admin";

const { createReadStream } = require("fs");
const es = require("event-stream");

function postELK() {
  fetch(URL, {
    method: "get",
    headers: new Headers({
      Authorization: "Basic " + encode(username + ":" + password)
    })
  }).then(response => {
    console.log(response.ok);
  });
}

const findLinesMatching = searchTerm => {
  return es.through(function(entry) {
    let lineno = 0;
    const matchingLines = [];
    const fileStream = this;

    createReadStream(entry.fullPath, { encoding: "utf-8" })
      // handle file contents line by line
      .pipe(
        es.through(data => {
          console.log("data");
        })
      );
  });
};

// create a stream of all javascript files found in this and all sub directories
// find all lines matching the term
// for each file (if none found, that file is ignored)
readdirp(__dirname, { fileFilter: "*.js" })
  .pipe(findLinesMatching("ming"))
