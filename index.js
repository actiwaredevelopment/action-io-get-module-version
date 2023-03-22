const fs = require('fs');
const path = require('path');
const core = require('@actions/core');

try {
	// `module-definition-file` input defined in action metadata file
	const ignoreInfoJson = core.getBooleanInput('ignore-info-json') ?? false;

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
	let moduleVersionNoBuild = '';

	let day = String(now.getDate()).padStart(2, '0');
	let month = String(now.getMonth() + 1).padStart(2, '0');

	if (day.length === 1) {
		day = `0${day}`;
	}

	if (month.length === 1) {
		month = `0${month}`;
	}

	const versionPostFix = `${month}${day}`;

	const alternativeBuildVersion =
		core.getInput('alternative-build-version') ?? versionPostFix;

	if (ignoreInfoJson == true || !fs.existsSync(filePath)) {
		console.log(`  - ${filePath} (Not Found)`);
		console.log(
			`  - ${fallbackVersion}.${alternativeBuildVersion} (Fallback)`
		);

		moduleVersion = `${fallbackVersion}.${alternativeBuildVersion}`;
		moduleVersionNoBuild = `${fallbackVersion}`;
	} else {
		const moduleDefinition = JSON.parse(fs.readFileSync(filePath, 'utf8'));

		if (!moduleDefinition || !moduleDefinition.version) {
			console.log(`  - ${fallbackVersion}.${versionPostFix} (Fallback)`);

			moduleVersion = `${fallbackVersion}.${versionPostFix}`;
			moduleVersionNoBuild = `${fallbackVersion}`;
		} else {
			console.log(`  - ${moduleDefinition.version}`);

			moduleVersion = `${moduleDefinition.version}`;
			moduleVersionNoBuild = `${moduleVersion}`;
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

		if (alternativeBuildVersion !== '') {
			if (version.length > 3) {
				version[3] = alternativeBuildVersion;
			} else {
				version.push(alternativeBuildVersion);
			}
		}

		if (version && version.length > 0) {
			moduleVersion = version.join('.');

			if (version && version.length > 3) {
				moduleVersionNoBuild = `${version[0]}.${version[1]}.${version[2]}`;
			} else {
				moduleVersionNoBuild = `${moduleVersion}`;
			}
		}
	}

	console.log(`Version: ${moduleVersion}`);
	console.log(`Version (without build version): ${moduleVersionNoBuild}`);

	core.setOutput('version', `${moduleVersion}`);
	core.setOutput('versionNoBuild', `${moduleVersionNoBuild}`);
} catch (error) {
	core.setFailed(error.message);
}
