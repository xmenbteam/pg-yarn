"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testingFolder = exports.removeProject = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const removeProject = async (projectName) => {
    try {
        await promises_1.default.rm(`./${projectName}`, { recursive: true });
        console.log("project removed...");
    }
    catch (err) {
        console.log(err);
    }
};
exports.removeProject = removeProject;
const testingFolder = (testingFramework) => {
    switch (testingFramework) {
        case "jest":
            return "__tests__";
        case "mocha":
            return "test";
        case "chai":
            return "test";
        default:
            return "test";
    }
};
exports.testingFolder = testingFolder;
