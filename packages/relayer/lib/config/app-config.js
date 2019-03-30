var nconf = require("nconf");

nconf
  .argv()
  .env()
  .file({ file: "./lib/config/app-config.json" });

module.exports = nconf;
