'use strict';
//ming

const {createReadStream} = require('fs');
const es = require('event-stream');
const readdirp = require('readdirp');

const findLinesMatching = (searchTerm) => {
  return es.through(function (entry) {
    let lineno = 0;
    const matchingLines = [];
    const fileStream = this;

    createReadStream(entry.fullPath, {encoding: 'utf-8'})
      // handle file contents line by line
      .pipe(es.split('\n'))
      // filter, keep only the lines that matched the term
      .pipe(es.mapSync((line) => {
        lineno++;
        return ~line.indexOf(searchTerm) ? `${lineno}: ${line}` : undefined;
      }))
      // aggregate matching lines and delegate control back to the file stream
      .pipe(es.through(
        (data) => { console.log(data); matchingLines.push(data); },
        () => {
          // drop files that had no matches
          if (matchingLines.length) {
            const result = { file: entry, lines: matchingLines };
            fileStream.emit('data', result); // pass result on to file stream
          }
          this.emit('end');
        }));
  });
};

// create a stream of all javascript files found in this and all sub directories
// find all lines matching the term
// for each file (if none found, that file is ignored)
readdirp(__dirname, {fileFilter: '*.js'})
  .pipe(findLinesMatching('ming'))
  .pipe(es.mapSync((res) => {
    // format the results and output
    return `\n\n${res.file.path}\n\t${res.lines.join('\n\t')}`;
  }))
  .pipe(process.stdout);
