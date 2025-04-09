import fs from "node:fs";
import path from "node:path";
import chalk from "chalk";
import {
	type AllDependenciesVersions,
	type AllDevDependenciesVersions,
	packageDependenciesVersions,
	packageDevDependenciesVersions,
} from "../utils/constant";

export const addPackageDependencies = (
	appPath: string,
	updates: {
		dependencies?: AllDependenciesVersions[];
		devDependencies?: AllDevDependenciesVersions[];
	},
) => {
	const { dependencies = [], devDependencies = [] } = updates;
	const packageJsonPath = path.join(appPath, "package.json");
	try {
		const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

		if (!packageJson.dependencies) packageJson.dependencies = {};
		if (!packageJson.devDependencies) packageJson.devDependencies = {};

		for (const dep of dependencies) {
			packageJson.dependencies[dep] = packageDependenciesVersions[dep];
		}

		for (const dep of devDependencies) {
			packageJson.devDependencies[dep] = packageDevDependenciesVersions[dep];
		}

		fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
	} catch (error) {
		console.error(
			chalk.yellow(
				"⚠️  Warning: Could not update package.json with dependencies",
			),
		);
		throw error;
	}
};
