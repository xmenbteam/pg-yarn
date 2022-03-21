#!/usr/bin/env node

import { projectGenerator } from "./index";

const zshPath: string = process.cwd();
const zshName: string = process.argv[2];
const zshUrl: string = process.argv[3];

const callBack = (err: Error, success: string) =>
  console.log(err ? `ERROR --> ${err}` : success);

console.log("ProjectName:", zshName);
console.log("Path", zshPath);
if (zshUrl) console.log("URL:", zshUrl);

module.exports.pgyarn = projectGenerator(zshName, zshPath, zshUrl, callBack);
