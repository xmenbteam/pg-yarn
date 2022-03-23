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
const projectGenerator = async (projectName = "my_new_project", path, testingFramework, isGithub, hasGitHubCLI, url = "", cb) => {
    const dir = `${path}/${projectName}`;
    const readMeHeader = `# ${projectName}`;
    const helloWorld = 'console.log("hello, world!")';
    const testToDo = 'test.todo("Make some tests");';
    const eslintText = { toDo: "make some lint" };
    const gitignoreText = "node_modules";
    const installCommand = `cd ${dir} && yarn init -y`;
    const gitInit = `cd ${dir} && git init --initial-branch=main`;
    const installTestFramework = `cd ${dir} && yarn add ${testingFramework} -D`;
    const gitAddOrigin = `cd ${dir} && git remote add origin ${url}`;
    const gitCLICreate = `cd ${dir} && gh repo create ${projectName} --public --source=. --remote=origin`;
    let testFolder = (0, utils_1.testingFolder)(testingFramework);
    try {
        console.log("Writing Dir...");
        await (0, promises_1.mkdir)(dir);
        console.log("Writing index.js...");
        await (0, promises_1.writeFile)(`${dir}/index.js`, helloWorld);
        console.log("Initialising project...");
        await exec(installCommand, { stdio: "ignore" });
        console.log(".gitignore...");
        await (0, promises_1.writeFile)(`${dir}/.gitignore`, gitignoreText);
        console.log(`${testFolder}/test.js...`);
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
        const newPackage = Object.assign(Object.assign({}, parsedPackage), { scripts: { test: testingFramework } });
        await (0, promises_1.writeFile)(`${dir}/package.json`, JSON.stringify(newPackage, null, 2));
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
                const { stdout: stagingOut } = await exec(`cd ${dir} && git add .`, {
                    stdio: "ignore",
                });
                console.log(stagingOut);
                console.log("Committing...");
                const { stdout: commitOut } = await exec(`cd ${dir} && git commit -m "original commit"`, {
                    stdio: "ignore",
                });
                console.log(commitOut);
                console.log("Pushing...");
                const { stdout: pushOut } = await exec(`cd ${dir} && git push origin main`, { stdio: "ignore" });
                console.log(pushOut);
                console.log("Push successful!");
            }
            catch (err) {
                console.log("Remote failed! \n", { err });
            }
        }
        const buildMessage = isGithub
            ? "Project built!"
            : "Project built, please add a github remote!";
        cb(null, buildMessage);
    }
    catch (err) {
        cb(err, null);
    }
};
exports.projectGenerator = projectGenerator;
