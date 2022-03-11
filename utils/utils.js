const fs = require("fs/promises");

const removeProject = async (projectName) => {
  try {
    await fs.rm(`./${projectName}`, { recursive: true });
    console.log("project removed...");
  } catch (err) {
    console.log(err);
  }
};

module.exports = removeProject;
