const fs = require("fs");
const core = require('@actions/core');

try {
    // `module-definition-file` input defined in action metadata file
    const moduleDefinitionFile = core.getInput('module-definition-file');
    const fallbackVersion = core.getInput('fallback-version') ?? '2.0.0';

    const now = new Date();

    const day = now.getDay().toString();
    const month = now.getMonth().toString();

    if (day.length === 1) {
        day = `0${day}`;
    }

    if (month.length === 1) {
        month = `0${month}`;
    }

    const versionPostFix = `${month}${day}`;

    if (!fs.existsSync(moduleDefinitionFile)) {
        console.log(`  - ${moduleDefinitionFile} (Not Found)`);
        console.log(`  - ${fallbackVersion} (Fallback)`);

        core.setOutput('version', `${fallbackVersion}.${versionPostFix}`);
    } else {
        const moduleDefinition = JSON.parse(fs.readFileSync(moduleDefinitionFile, 'utf8'));

        if (!moduleDefinition || !moduleDefinition.version) {
            console.log(`  - ${fallbackVersion} (Fallback)`);

            core.setOutput('version', `${fallbackVersion}.${versionPostFix}`);
        } else {
            console.log(`  - ${moduleDefinition.version}`);

            core.setOutput('version', `${moduleDefinition.version}`);
        }
    }
} catch (error) {
    core.setFailed(error.message);
}