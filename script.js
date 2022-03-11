const projectGenerator = require(".");

const zshName = process.argv[1];
const zshUrl = process.argv[2];

const callBack = (err, success) =>
  console.log(err ? `ERROR --> ${err}` : success);

module.exports.pgyarn = projectGenerator(zshName, zshUrl, callBack);
