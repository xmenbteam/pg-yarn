#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const zshPath = process.cwd();
const zshName = process.argv[2];
const zshUrl = process.argv[3];
const callBack = (err, success) => console.log(err ? `ERROR --> ${err}` : success);
console.log("ProjectName:", zshName);
console.log("Path", zshPath);
if (zshUrl)
    console.log("URL:", zshUrl);
module.exports.pgyarn = (0, index_1.projectGenerator)(zshName, zshPath, zshUrl, callBack);
