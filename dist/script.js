#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = __importDefault(require("inquirer"));
const index_1 = require("./index");
const questions_1 = require("./utils/questions");
const zshPath = process.cwd();
const initFunc = async () => {
    const { projectName, testingFramework } = await inquirer_1.default.prompt(questions_1.nameAndFrameWorkQs);
    const { isGithub, hasGitHubCLI } = await inquirer_1.default.prompt(questions_1.gitHubQs);
    const { url } = await inquirer_1.default.prompt(questions_1.urlQ);
    const callBack = (err, success) => console.log(err ? `ERROR --> ${err}` : success);
    console.log("ProjectName:", projectName);
    console.log("Path", zshPath);
    return (0, index_1.projectGenerator)(projectName, zshPath, testingFramework, isGithub, hasGitHubCLI, url, callBack);
};
module.exports.pgyarn = initFunc();
