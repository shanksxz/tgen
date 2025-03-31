import path from "node:path";
import process from "node:process";
import chalk from "chalk";
import { templatesDir } from "./helper/constant";
import {
	deleteDirectoryContents,
	isDirectoryEmpty,
	validateTemplate,
} from "./helper/validator";
import { createCliProgram } from "./project/cli";
import { setupProject } from "./project/setup";
import { askDatabasePreferences, askProjectPreferences } from "./prompts";
import type { ProjectConfig } from "./types";

const runCli = async () => {
	const program = createCliProgram().parse();

	try {
		console.log(chalk.blue("\n🚀 Initializing turbo-repo project..."));
		const options = program.opts();
		const directory = program.args[0] || ".";

		const projectPath = path.resolve(process.cwd(), directory);
		const projectName =
			directory === "."
				? path.basename(process.cwd())
				: path.basename(projectPath);

		console.log(chalk.cyan("\n📋 Project name:"), projectName);
		console.log(chalk.cyan("📁 Project path:"), projectPath);

		const isDirEmpty = await isDirectoryEmpty(projectPath);
		if (!isDirEmpty) {
			await deleteDirectoryContents(projectPath);
		}

		const { shouldInitGit, shouldInstallDeps, packageManager, useHusky } =
			await askProjectPreferences(options);
		const dbPrefs = await askDatabasePreferences();

		const baseTemplatePath = path.join(templatesDir, "base");
		const isBaseValid = await validateTemplate(baseTemplatePath);
		if (!isBaseValid) {
			throw new Error("Base turbo-repo template not found!");
		}

		const projectConfig: ProjectConfig = {
			name: projectName,
			template: "base",
			database: dbPrefs.database,
			husky: useHusky,
			npm: packageManager === "npm",
			pnpm: packageManager === "pnpm",
			bun: packageManager === "bun",
			drizzle: dbPrefs.drizzle,
			prisma: dbPrefs.prisma,
			install: shouldInstallDeps,
			skipInstall: !shouldInstallDeps,
			skipGit: !shouldInitGit,
			turbo: true,
		};

		await setupProject(projectPath, projectName, projectConfig);
	} catch (error) {
		console.log(
			chalk.red("\n❌ Error:"),
			error instanceof Error ? error.message : "An unknown error occurred",
		);
		process.exit(1);
	}
};

runCli();
