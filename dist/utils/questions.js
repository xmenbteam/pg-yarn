"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlQ = exports.gitHubQs = exports.nameAndFrameWorkQs = void 0;
const inquirer_1 = require("inquirer");
const projectName = {
    type: "input",
    name: "projectName",
    message: "What do you want your project to be called?!",
    default: "my_new_project",
};
const isTypeScript = {
    type: "confirm",
    name: "isTypeScript",
    message: "Would you like to set the project up with TypeScript?",
    default: true,
};
const testingFramework = {
    type: "list",
    name: "testingFramework",
    message: "Which testing library would you like to use?",
    default: "jest",
    choices: ["jest", new inquirer_1.Separator(), "mocha", new inquirer_1.Separator(), "chai"],
};
const isGithub = {
    type: "confirm",
    name: "isGithub",
    message: "Would you like to set up a Github Repo?",
    default: true,
};
const hasGitHubCLIInstalled = {
    type: "confirm",
    name: "hasGitHubCLI",
    message: "Have you got GitHub CLI installed?",
    default: true,
};
const url = {
    type: "input",
    name: "url",
    message: "Please provide a url (leave blank if you want to set this up later)",
};
exports.nameAndFrameWorkQs = [
    projectName,
    isTypeScript,
    testingFramework,
];
exports.gitHubQs = [
    isGithub,
    hasGitHubCLIInstalled,
];
exports.urlQ = [url];
