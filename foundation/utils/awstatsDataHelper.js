const fs = require("fs");

function getLines(fileContents) {
    return fileContents.toString().split(/\r?\n/); 
}

function getObjectFromLine(name, line) {
    const parts = line.split(" ");
    if (parts.length == 0) return;

    var output = new Object();

    switch(name) {
        case 'general':
            output.stat = parts[0];
            switch(parts[0].toLowerCase()) {
                case 'lastline':
                    output.dateoflastrecordprocessed = parts[1];
                    output.lastrecordlinenumber = parts[2];
                    output.lastrecordoffset = parts[3];
                    output.lastrecordsignature = parts[4];
                    break;
                case 'firsttime':
                    output.dateoffirstvisit = parts[1];
                    break;
                case 'lasttime':
                    output.dateoflastvisit = parts[1];
                    break;
                case 'lastupdate':
                    output.dateoflastupdate = parts[1];
                    output.parsedrecords = parts[2];
                    output.parsedoldrecords = parts[3];
                    output.parsednewrecords = parts[4];
                    output.parsedcorruptedrecords = parts[5];
                    output.parseddroppedrecords = parts[6];
                    break;
                case 'totalvisits':
                case 'totalunique':
                case 'monthhostsknown':
                case 'monthhostsunknown':
                    output.number = parts[1];
                    break;
                default:
                    logger.info(`Unrecognized general stat found: ${parts[0]}`);
                    break;
            }
            break;
        case 'misc':
            output.id = parts[0];
            output.pages = parts[1];
            output.hits = parts[2];
            output.bandwidth = parts[3];
            break;
        case 'time':
            output.hour = parts[0];
            output.pages = parts[1];
            output.hits = parts[2];
            output.bandwidth = parts[3];
            output.notviewedpages = parts[4];
            output.notviewedhits = parts[5];
            output.notviewedbandwidth = parts[6];
            break;
        case 'domain':
            output.domain = parts[0];
            output.pages = parts[1];
            output.hits = parts[2];
            output.bandwidth = parts[3];
            break;
        case 'cluster':
            output.cluster = parts[0];
            output.pages = parts[1];
            output.hits = parts[2];
            output.bandwidth = parts[3];
            break;
        case 'login':
            output.login = parts[0];
            output.pages = parts[1];
            output.hits = parts[2];
            output.bandwidth = parts[3];
            output.lastvisit = parts[4];
            break;
        case 'robot':
            output.robot = parts[0];
            output.hits = parts[1];
            output.bandwidth = parts[2];
            output.lastvisit = parts[3];
            output.hitsonrobotstxt = parts[4];
            break;
        case 'worms':
            output.worm = parts[0];
            output.hits = parts[1];
            output.bandwidth = parts[2];
            output.lastvisit = parts[3];
            break;
        case 'emailsender':
            output.email = parts[0];
            output.hits = parts[1];
            output.bandwidth = parts[2];
            output.lastvisit = parts[3];
            break;
        case 'emailreceiver':
            output.email = parts[0];
            output.hits = parts[1];
            output.bandwidth = parts[2];
            output.lastvisit = parts[3];
            break;
        case 'filetypes':
            output.filetype = parts[0];
            output.hits = parts[1];
            output.bandwidth = parts[2];
            output.bandwidthwocompression = parts[3];
            output.bandwidthaftercompression = parts[4];
            break;
        case 'downloads':
            output.file = parts[0];
            output.hits = parts[1];
            output.bandwidth = parts[2];
            break;
        case 'os':
            output.os = parts[0];
            output.hits = parts[1];
            output.pages = parts[2];
            break;
        case 'browser':
            output.browser = parts[0];
            output.hits = parts[1];
            output.pages = parts[2];
            break;
        case 'screensize':
            output.screensize = parts[0];
            output.hits = parts[1];
            break;
        case 'unknownreferer':
            output.os = parts[0];
            output.lastvisitdate = parts[1];
            break;
        case 'unknownrefererbrowser':
            output.browser = parts[0];
            output.lastvisitdate = parts[1];
            break;
        case 'origin':
            output.origin = parts[0];
            output.pages = parts[1];
            output.hits = parts[2];
            break;
        case 'sereferrals':
            output.referer = parts[0];
            output.pages = parts[1];
            output.hits = parts[2];
            break;
        case 'pagerefs':
            output.referer = parts[0];
            output.pages = parts[1];
            output.hits = parts[2];
            break;
        case 'searchwords':
            output.phrase = parts[0];
            output.number = parts[1];
            break;
        case 'keywords':
            output.word = parts[0];
            output.number = parts[1];
            break;
        case 'errors':
            output.error = parts[0];
            output.hits = parts[1];
            output.bandwidth = parts[2];
            break;
        case 'sider_403':
            output.url = parts[0];
            output.hits = parts[1];
            output.lastreferer = parts[2];
            break;
        case 'sider_400':
            output.url = parts[0];
            output.hits = parts[1];
            output.lastreferer = parts[2];
            break;
        case 'sider_404':
            output.url = parts[0];
            output.hits = parts[1];
            output.lastreferer = parts[2];
            break;
        case 'visitor':
            output.host = parts[0];
            output.pages = parts[1];
            output.hits = parts[2];
            output.bandwidth = parts[3];
            output.lastvisit = parts[4];
            break;
        case 'day':
            output.date = parts[0];
            output.pages = parts[1];
            output.hits = parts[2];
            output.bandwidth = parts[3];
            output.visits = parts[4];
            break;
        case 'session':
            output.range = parts[0];
            output.visits = parts[1];
            break;
        case 'sider':
            output.url = parts[0];
            output.pages = parts[1];
            output.bandwidth = parts[2];
            output.entry = parts[3];
            output.exit = parts[4];
            break;
        default: 
            logger.info(`Unrecognized data file section found: ${name}`);
    }

    return output;
}

module.exports = function (logger) {
    this.logger = logger;

    return {
        convertDataFile: function(filePath) {
            const awstatsDataContent = fs.readFileSync(filePath);
            const lines = getLines(awstatsDataContent);

            var output = Object();

            logger.debug(`${lines.length} lines`);

            for (i = 0; i < lines.length; i++) {
                const line = lines[i].trim().toLowerCase();
                if (line.startsWith("begin_")) {
                    const parts = line.split(" ");
                    if (parts.length > 1 && !parts[0].endsWith("map")) {
                        var name = parts[0].replace("begin_", "");
                        var length = parseInt(parts[parts.length-1]);
                        logger.debug(`Section found: ${name} - ${length}`)

                        output[name] = [];
                        for (l = (i + 1); l < (i + 1 + length); l++) {
                            output[name].push(getObjectFromLine(name, lines[l]));
                        }
                        i = i + 1 + length;
                    }
                }
            }

            return JSON.stringify(output, null, 2);
        }
    }
};