"use strict";

const optimist = require("optimist");
const logger = require("./utils/logger").logger;
const fs = require("fs");

const version = "1.0";
const separator = "---------------------------------------------------------";

logger.info(`AWStatsMakeover v${version}`);
logger.info(separator);

// get command line args
const debug = optimist.argv["debug"] || false;
const config = optimist.argv["config"] || "config.json";

logger.info(`debug: ${debug}`);
logger.info(`config: ${config}`);
logger.info(separator);

// read config
const cfg = JSON.parse(fs.readFileSync(config));

