const fs = require('fs');
const path = require('path');
const core = require('@actions/core');

try {
	// `module-definition-file` input defined in action metadata file
	const moduleDefinitionFile = core.getInput('module-definition-file');
	const filePath = path.join(
		process.env.GITHUB_WORKSPACE,
		moduleDefinitionFile
	);
	const fallbackVersion = core.getInput('fallback-version') ?? '2.0.0';

	const alternativeMajorVersion =
		core.getInput('alternative-major-version') ?? '';
	const alternativeMinorVersion =
		core.getInput('alternative-minor-version') ?? '';

	const now = new Date();

	let moduleVersion = '';

	let day = now.getDay().toString();
	let month = now.getMonth().toString();

	if (day.length === 1) {
		day = `0${day}`;
	}

	if (month.length === 1) {
		month = `0${month}`;
	}

	const versionPostFix = `${month}${day}`;

	if (!fs.existsSync(filePath)) {
		console.log(`  - ${filePath} (Not Found)`);
		console.log(`  - ${fallbackVersion}.${versionPostFix} (Fallback)`);

		moduleVersion = `${fallbackVersion}.${versionPostFix}`;
	} else {
		const moduleDefinition = JSON.parse(fs.readFileSync(filePath, 'utf8'));

		if (!moduleDefinition || !moduleDefinition.version) {
			console.log(`  - ${fallbackVersion}.${versionPostFix} (Fallback)`);

			moduleVersion = `${fallbackVersion}.${versionPostFix}`;
		} else {
			console.log(`  - ${moduleDefinition.version}`);

			moduleVersion = `${moduleDefinition.version}`;
		}
	}

	if (moduleVersion) {
		const version = moduleVersion.split('.');

		if (alternativeMajorVersion && version.length > 0) {
			version[0] = alternativeMajorVersion;
		}

		if (alternativeMinorVersion && version.length > 1) {
			version[1] = alternativeMinorVersion;
		}

		if (version && version.length > 0) {
			moduleVersion = version.join('.');
		}
	}

	console.log(`Version: ${moduleVersion}`);

	core.setOutput('version', `${moduleVersion}`);
} catch (error) {
	core.setFailed(error.message);
}
