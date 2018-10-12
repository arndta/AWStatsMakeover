"use strict";

const optimist = require("optimist");
const debug = optimist.argv["debug"] || false;
const config = optimist.argv["config"] || "config.json";

const logger = require("./utils/logger")(debug).logger;
const fs = require("fs");
const ach = require("./utils/awstatsConfigHelper")(logger);
const adh = require("./utils/awstatsDataHelper")(logger);
const request = require('request');

const version = "1.0";
const separator = "---------------------------------------------------------";

logger.info(`AWStatsMakeover v${version}`);
logger.info(separator);

logger.info(`debug: ${debug}`);
logger.info(`config: ${config}`);
logger.info(separator);

// read config
if (!fs.existsSync(config)) {
    logger.error(`Config file not found: ${config}`);
    return;
} else {
    logger.debug(`Config file found: ${config}`);
}
const cfg = JSON.parse(fs.readFileSync(config));

logger.info(`${cfg.sites.length} sites found in config`);

var sites = [];

cfg.sites.forEach(function(val){
    if (!val.outputPath.match(/\/$/))
        val.outputPath = `${val.outputPath}/`;

    logger.debug(`Site loaded: "${val.awstatsConfig}" - "${val.outputPath}"`);

    if (!fs.existsSync(val.awstatsConfig)) {
        logger.error(`Path not found: ${val.awstatsConfig}`);
        return;
    } else {
        logger.debug(`File found: ${val.awstatsConfig}`);
    }

    const awstatsConfigContent = fs.readFileSync(val.awstatsConfig);
    const url = ach.getUrlFromConfig(awstatsConfigContent);
    logger.debug(`Url found in config: ${url}`);
    const dataDir = ach.getDataDirFromConfig(awstatsConfigContent);
    logger.debug(`DataDir found in config: ${dataDir}`);

    if (!fs.existsSync(val.outputPath)){
        logger.debug(`Creating output path: ${val.outputPath}`);
        fs.mkdirSync(val.outputPath);
    }

    if (cfg.generateThumbnails) {
        const thumbPath = `${val.outputPath}thumb.jpg`;
            
        if (fs.existsSync(thumbPath))
        {
            logger.debug(`Removing current thumbnail: ${thumbPath}`);
            fs.unlink(`${thumbPath}`);
        }

        logger.debug(`Requesting site thumbnail for ${url}`);
        request(`https://api.letsvalidate.com/v1/thumbs/?format=png&url=${url}`, 
            function (error, response, body) {
                if (error)
                    logger.error(`Error getting site thumbnail: ${error}`);
                else
                    logger.debug(`Thumbnail created: ${thumbPath}`);
        })
        .pipe(fs.createWriteStream(thumbPath))
        .on('error', function(error){logger.error(`Error writing thumbnail: ${error}`)})
    }

    const site = new Object();
    site.url = url;
    sites.push(site);
    
    var files = [];
    fs.readdirSync(dataDir).forEach(file => {
        if (!file.toLowerCase().startsWith('awstats')) return;

        logger.debug(`Data file found: ${file}`);
        const data = adh.convertDataFile(`${dataDir}/${file}`);
        const fileOut = file.replace("txt", "json");

        if (fs.existsSync(`${val.outputPath}/${fileOut}`))
            fs.unlinkSync(`${val.outputPath}/${fileOut}`);
        
        logger.debug(`Writing JSON file to: ${val.outputPath}/${fileOut}`);
        fs.writeFileSync(`${val.outputPath}/${fileOut}`, data);
        files.push(fileOut);
    });

    if (!fs.existsSync(val.outputPath))
        fs.mkdirSync(val.outputPath);

    const fileList = JSON.stringify(files, null, 2);
    fs.writeFileSync(`${val.outputPath}/fileindex.json`, fileList);
});

if (cfg.generateSiteListing) {
    if (!fs.existsSync(cfg.siteListingOutputPath))
        fs.mkdirSync(cfg.siteListingOutputPath);

    const siteList = JSON.stringify(sites, null, 2);
    fs.writeFileSync(`${cfg.siteListingOutputPath}/sitelisting.json`, siteList);    
}

