const fs = require("fs");
const core = require('@actions/core');

const moment = require('moment');

function action() {
    try {
        // `module-definition-file` input defined in action metadata file
        const moduleDefinitionFile = core.getInput('module-definition-file');
        const fallbackVersion = core.getInput('fallback-version') ?? '2.0.0';

        const time = moment().utcOffset();
        const versionPostFix = time.format('YYMM');

        if (!fs.existsSync(moduleDefinitionFile)) {
            console.log(`  - ${moduleDefinitionFile} (Not Found)`);
            console.log(`  - ${fallbackVersion} (Fallback)`);

            core.setOutput('version', `${fallbackVersion}.${versionPostFix}`);
            return;
        }

        const moduleDefinition = JSON.parse(fs.readFileSync(moduleDefinitionFile, 'utf8'));

        if (!moduleDefinition || !moduleDefinition.version) {
            console.log(`  - ${fallbackVersion} (Fallback)`);

            core.setOutput('version', `${fallbackVersion}.${versionPostFix}`);
            return;
        }

        console.log(`  - ${moduleDefinition.version}`);

        core.setOutput('version', `${moduleDefinition.version}`);
    } catch (error) {
        core.setFailed(error.message);
    }
}

module.exports = action;