function getLines(fileContents) {
    return fileContents.toString().split(/\r?\n/); 
}

module.exports = function (logger) {
    this.logger = logger;

    return {
        getUrlFromConfig: function(config) {
            const lines = getLines(config);

            for (i = 0; i < lines.length; i++) {
                const line = lines[i];
                if (!line.trim().startsWith("#") && !line.trim() == "") {
                    const sections = line.trim().split("=");
                    if (sections.length > 1) {
                        if (sections[0].trim().toLowerCase() == "sitedomain") {
                            logger.debug(`Site domain setting found in line: ${line.trim()}`);
                            return sections[1].replace(/^"/, '').replace(/"$/, '');
                        }
                    }
                }
            }

            return '';
        },

        getDataDirFromConfig: function(config) {
            const lines = getLines(config);

            for (i = 0; i < lines.length; i++) {
                const line = lines[i];
                if (!line.trim().startsWith("#") && !line.trim() == "") {
                    const sections = line.trim().split("=");
                    if (sections.length > 1) {
                        if (sections[0].trim().toLowerCase() == "dirdata") {
                            //this.logger.debug(`Site domain setting found in line: ${line.trim()}`);
                            return sections[1].replace(/^"/, '').replace(/"$/, '');
                        }
                    }
                }
            }

            return '';
        }
    }
};