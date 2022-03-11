#!/usr/bin/env node

const projectGenerator = require("./index.js");

const zshPath = process.cwd();
const zshName = process.argv[2];
const zshUrl = process.argv[3];

const callBack = (err, success) =>
  console.log(err ? `ERROR --> ${err}` : success);

console.log("ProjectName:", zshName);
console.log("Path", zshPath);
if (zshUrl) console.log("URL:", zshUrl);

module.exports.pgyarn = projectGenerator(zshName, zshPath, zshUrl, callBack);
