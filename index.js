const { mkdir, writeFile, readFile } = require("fs/promises");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

const projectGenerator = async (projectName = "my_new_project", url, cb) => {
  const dir = `${__dirname}/${projectName}`;
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
    await mkdir(dir);

    console.log("Writing index.js...");
    await writeFile(`${dir}/index.js`, helloWorld);

    console.log("Initialising project...");
    await exec(installCommand, { stdio: "ignore" });

    console.log(".gitignore...");
    await writeFile(`${dir}/.gitignore`, gitignoreText);

    console.log("specDir/test.js...");
    await mkdir(specDir);
    await writeFile(`${specDir}/index.test.js`, testToDo);

    console.log("Readme...");
    await writeFile(`${dir}/README.md`, readMeHeader);

    console.log("Git init...");
    await exec(gitInit, { stdio: "ignore" });
    await writeFile(
      `${dir}/.eslintrc.json`,
      JSON.stringify(eslintText, null, 2)
    );

    console.log("Installing jest...");
    const { stdout: jestOut } = await exec(installJest, { stdio: "ignore" });
    console.log(jestOut);

    console.log("Writing test script");
    const packageJSON = await readFile(`${dir}/package.json`);
    const parsedPackage = JSON.parse(packageJSON);
    newPackage = {
      ...parsedPackage,
      scripts: { test: "jest" },
    };
    await writeFile(`${dir}/package.json`, JSON.stringify(newPackage, null, 2));

    if (url) {
      try {
        console.log(`Adding origin ${url}`);
        const { stdout: gitOut } = await exec(gitAddOrigin, {
          stdio: "ignore",
        });
        console.log(gitOut);

        console.log("Staging...");
        const { stdout: stagingOut } = await exec(`cd ${dir} && git add .`, {
          stdio: "ignore",
        });
        console.log(stagingOut);
        console.log("Committing...");
        const { stdout: commitOut } = await exec(
          `cd ${dir} && git commit -m "original commit"`,
          {
            stdio: "ignore",
          }
        );
        console.log(commitOut);

        console.log("Pushing...");
        const { stdout: pushOut } = await exec(
          `cd ${dir} && git push origin main`,
          { stdio: "ignore" }
        );
        console.log(pushOut);
        console.log("Push successful!");
      } catch (err) {
        console.log("Remote failed! \n", { err });
      }
    }
    const buildMessage = url
      ? "Project built!!"
      : "Project built, please add a github remote!";
    cb(null, buildMessage);
  } catch (err) {
    cb(err, null);
  }
  cb(null, "success");
};

module.exports = projectGenerator;
