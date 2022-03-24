import { mkdir, writeFile, readFile } from "fs/promises";
import util from "util";
import { testingFolder } from "./utils/utils";
const exec = util.promisify(require("child_process").exec);
import { sampleTSConfig } from "./utils/sampleJSONs/sampleTSConfig";
import { fstat } from "fs";

export const projectGenerator = async (
  projectName = "my_new_project",
  path: string,
  isTypeScript: boolean,
  testingFramework: string,
  isGithub: boolean,
  hasGitHubCLI: boolean,
  url: string = "",
  cb: Function
) => {
  const dir: string = `${path}/${projectName}`;
  const readMeHeader: string = `# ${projectName}`;
  const helloWorld: string = 'console.log("hello, world!")';
  const testToDo: string = 'test.todo("Make some tests");';
  const eslintText: object = { toDo: "make some lint" };
  const gitignoreText: string = "node_modules";
  const installCommand: string = `cd ${dir} && yarn init -y`;
  const gitInit: string = `cd ${dir} && git init --initial-branch=main`;
  const installTestFramework: string = `cd ${dir} && yarn add ${testingFramework} -D`;
  const TSInstall = `tsc --init`;
  const TSDev = `yarn add typescript --save-dev`;
  const gitAddOrigin: string = `cd ${dir} && git remote add origin ${url}`;
  const gitCLICreate: string = `cd ${dir} && gh repo create ${projectName} --public --source=. --remote=origin`;

  let testFolder: string = testingFolder(testingFramework);

  try {
    console.log("Writing Dir...");
    await mkdir(dir);

    console.log("Writing index.js...");
    await writeFile(`${dir}/index.js`, helloWorld);

    console.log("Initialising project...");
    await exec(installCommand, { stdio: "ignore" });

    console.log(".gitignore...");
    await writeFile(`${dir}/.gitignore`, gitignoreText);

    console.log(`${testFolder}/test.js...`);
    await mkdir(`${dir}/${testFolder}`);
    await writeFile(`${dir}/${testFolder}/index.test.js`, testToDo);

    console.log("Readme...");
    await writeFile(`${dir}/README.md`, readMeHeader);

    console.log("Git init...");
    await exec(gitInit, { stdio: "ignore" });
    await writeFile(
      `${dir}/.eslintrc.json`,
      JSON.stringify(eslintText, null, 2)
    );

    console.log(`Installing ${testingFramework}...`);
    const { stdout: testOut } = await exec(installTestFramework, {
      stdio: "ignore",
    });
    console.log(testOut);

    console.log("Writing test script");
    const packageJSON: string = await readFile(`${dir}/package.json`, "utf-8");
    const parsedPackage: object = JSON.parse(packageJSON);
    const newPackage: object = {
      ...parsedPackage,
      scripts: { test: testingFramework },
    };
    await writeFile(`${dir}/package.json`, JSON.stringify(newPackage, null, 2));

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

      await writeFile(
        `${dir}/tsconfig.json`,
        JSON.stringify(sampleTSConfig, null, 2)
      );
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
      } catch (err) {
        console.log("Remote failed! \n", { err });
      }
    }
    const buildMessage = isGithub
      ? "Project built!"
      : "Project built, please add a github remote!";

    cb(null, buildMessage);
  } catch (err) {
    cb(err, null);
  }
};
