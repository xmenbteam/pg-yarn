"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectGenerator = void 0;
const { mkdir, writeFile, readFile } = require("fs/promises");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const projectGenerator = (projectName = "my_new_project", path, url, cb) => __awaiter(void 0, void 0, void 0, function* () {
    const dir = `${path}/${projectName}`;
    const specDir = `${dir}/spec`;
    const readMeHeader = `# ${projectName}`;
    const helloWorld = 'console.log("hello, world!")';
    const testToDo = 'test.todo("Make some tests");';
    const eslintText = { toDo: "make some lint" };
    const gitignoreText = "node_modules";
    const installCommand = `cd ${dir} && yarn init -y`;
    const gitInit = `cd ${dir} && git init --initial-branch=main`;
    const installJest = `cd ${dir} && yarn add jest -D`;
    const gitAddOrigin = `cd ${dir} && git remote add origin ${url}`;
    try {
        console.log("Writing Dir...");
        yield mkdir(dir);
        console.log("Writing index.js...");
        yield writeFile(`${dir}/index.js`, helloWorld);
        console.log("Initialising project...");
        yield exec(installCommand, { stdio: "ignore" });
        console.log(".gitignore...");
        yield writeFile(`${dir}/.gitignore`, gitignoreText);
        console.log("specDir/test.js...");
        yield mkdir(specDir);
        yield writeFile(`${specDir}/index.test.js`, testToDo);
        console.log("Readme...");
        yield writeFile(`${dir}/README.md`, readMeHeader);
        console.log("Git init...");
        yield exec(gitInit, { stdio: "ignore" });
        yield writeFile(`${dir}/.eslintrc.json`, JSON.stringify(eslintText, null, 2));
        console.log("Installing jest...");
        const { stdout: jestOut } = yield exec(installJest, { stdio: "ignore" });
        console.log(jestOut);
        console.log("Writing test script");
        const packageJSON = yield readFile(`${dir}/package.json`);
        const parsedPackage = JSON.parse(packageJSON);
        const newPackage = Object.assign(Object.assign({}, parsedPackage), { scripts: { test: "jest" } });
        yield writeFile(`${dir}/package.json`, JSON.stringify(newPackage, null, 2));
        if (url) {
            try {
                console.log(`Adding origin ${url}`);
                const { stdout: gitOut } = yield exec(gitAddOrigin, {
                    stdio: "ignore",
                });
                console.log(gitOut);
                console.log("Staging...");
                const { stdout: stagingOut } = yield exec(`cd ${dir} && git add .`, {
                    stdio: "ignore",
                });
                console.log(stagingOut);
                console.log("Committing...");
                const { stdout: commitOut } = yield exec(`cd ${dir} && git commit -m "original commit"`, {
                    stdio: "ignore",
                });
                console.log(commitOut);
                console.log("Pushing...");
                const { stdout: pushOut } = yield exec(`cd ${dir} && git push origin main`, { stdio: "ignore" });
                console.log(pushOut);
                console.log("Push successful!");
            }
            catch (err) {
                console.log("Remote failed! \n", { err });
            }
        }
        const buildMessage = url
            ? "Project built!"
            : "Project built, please add a github remote!";
        cb(null, buildMessage);
    }
    catch (err) {
        cb(err, null);
    }
});
exports.projectGenerator = projectGenerator;
