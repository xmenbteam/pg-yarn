"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectGenerator = void 0;
const promises_1 = require("fs/promises");
const util_1 = __importDefault(require("util"));
const utils_1 = require("./utils/utils");
const exec = util_1.default.promisify(require("child_process").exec);
const sampleTSConfig_1 = require("./utils/sampleJSONs/sampleTSConfig");
const projectGenerator = async (projectName = "my_new_project", path, isTypeScript, testingFramework, isGithub, hasGitHubCLI, url = "", cb) => {
    const dir = `${path}/${projectName}`;
    const readMeHeader = `# ${projectName}`;
    const helloWorld = 'console.log("hello, world!")';
    const testToDo = 'test.todo("Make some tests");';
    const eslintText = { toDo: "make some lint" };
    const gitignoreText = "node_modules";
    const installCommand = `cd ${dir} && yarn init -y`;
    const gitInit = `cd ${dir} && git init --initial-branch=main`;
    const installTestFramework = `cd ${dir} && yarn add ${testingFramework} -D`;
    const TSInstall = `cd ${dir} && tsc --init`;
    const TSDev = `cd ${dir} && yarn add typescript --save-dev`;
    const TSJestTypes = `cd ${dir} && yarn add @types/jest`;
    const ex = isTypeScript ? "ts" : "js";
    const gitAddOrigin = `cd ${dir} && git remote add origin ${url}`;
    const gitCLICreate = `cd ${dir} && gh repo create ${projectName} --public --source=. --remote=origin`;
    let testFolder = (0, utils_1.testingFolder)(testingFramework);
    try {
        console.log("Writing Dir...");
        await (0, promises_1.mkdir)(dir);
        console.log(`Writing index.${ex}...`);
        if (isTypeScript) {
            await (0, promises_1.mkdir)(`${dir}/src`);
            await (0, promises_1.writeFile)(`${dir}/src/index.ts`, helloWorld);
        }
        else
            await (0, promises_1.writeFile)(`${dir}/index.js`, helloWorld);
        console.log("Initialising project...");
        await exec(installCommand, { stdio: "ignore" });
        console.log(".gitignore...");
        await (0, promises_1.writeFile)(`${dir}/.gitignore`, gitignoreText);
        console.log(`${testFolder}/test.${ex}...`);
        await (0, promises_1.mkdir)(`${dir}/${testFolder}`);
        await (0, promises_1.writeFile)(`${dir}/${testFolder}/index.test.js`, testToDo);
        console.log("Readme...");
        await (0, promises_1.writeFile)(`${dir}/README.md`, readMeHeader);
        console.log("Git init...");
        await exec(gitInit, { stdio: "ignore" });
        await (0, promises_1.writeFile)(`${dir}/.eslintrc.json`, JSON.stringify(eslintText, null, 2));
        console.log(`Installing ${testingFramework}...`);
        const { stdout: testOut } = await exec(installTestFramework, {
            stdio: "ignore",
        });
        console.log(testOut);
        console.log("Writing test script");
        const packageJSON = await (0, promises_1.readFile)(`${dir}/package.json`, "utf-8");
        const parsedPackage = JSON.parse(packageJSON);
        const newPackage = Object.assign(Object.assign({}, parsedPackage), { scripts: { test: `${testingFramework} ./src`, tscw: "tsc --watch" } });
        await (0, promises_1.writeFile)(`${dir}/package.json`, JSON.stringify(newPackage, null, 2));
        if (isTypeScript) {
            console.log(`Installing TypeScript...`);
            const { stdout: tsinstout } = await exec(TSDev, {
                stdio: "ignore",
            });
            console.log(tsinstout);
            console.log(`Adding TSConfig...`);
            const { stdout: tsOut } = await exec(TSInstall, {
                stdio: "ignore",
            });
            console.log(tsOut);
            await (0, promises_1.writeFile)(`${dir}/tsconfig.json`, JSON.stringify(sampleTSConfig_1.sampleTSConfig, null, 2));
            console.log("Jest config...");
            await (0, promises_1.writeFile)(`${dir}/jest.config.js`, JSON.stringify((module.exports = {
                preset: "ts-jest",
                testEnvironment: "node",
            }), null, 2));
            console.log("Jest types...");
            const { stdout: jestTypesOut } = await exec(TSJestTypes);
            console.log(jestTypesOut);
        }
        if (isGithub) {
            try {
                if (url) {
                    console.log(`Adding origin...`);
                    const { stdout: gitOut } = await exec(gitAddOrigin, {
                        stdio: "ignore",
                    });
                    console.log(gitOut);
                }
                if (hasGitHubCLI) {
                    console.log(`Creating Github repo...`);
                    const { stdout: githubOut } = await exec(gitCLICreate, {
                        stdio: "ignore",
                    });
                    console.log(`Repo set up @ ${githubOut}`);
                }
                console.log("Staging...");
                await exec(`cd ${dir} && git add .`, {
                    stdio: "ignore",
                });
                console.log("Committing...");
                await exec(`cd ${dir} && git commit -m "original commit"`, {
                    stdio: "ignore",
                });
                console.log("Pushing...");
                await exec(`cd ${dir} && git push origin main`, { stdio: "ignore" });
                console.log("Push successful!");
            }
            catch (err) {
                console.log("Remote failed! \n", { err });
            }
        }
        const buildMessage = isGithub
            ? `Project built! cd into ./${projectName} to get started!`
            : `Project built, please add a github remote! cd into ./${projectName} to get started!`;
        cb(null, buildMessage);
    }
    catch (err) {
        cb(err, null);
    }
};
exports.projectGenerator = projectGenerator;
