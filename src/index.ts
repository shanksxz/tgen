import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import chalk from "chalk";
import inquirer from "inquirer";
import {
	deleteDirectoryContents,
	isDirectoryEmpty,
	validateTemplate,
} from "./helper/validator";
import { createCliProgram } from "./project/cli";
import { setupProject } from "./project/setup";
import { convertAnswersToConfig, promptSetupFlow } from "./prompts/flow";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "../");
const templatesDir = path.join(rootDir, "templates");

const runCli = async () => {
	const program = createCliProgram().parse();

	try {
		console.log(chalk.blue("\n🚀 Initializing turbo-repo project..."));
		const options = program.opts();
		const directory = program.args[0];

		const projectPath = path.resolve(process.cwd(), directory);
		const projectName =
			directory === "."
				? path.basename(process.cwd())
				: path.basename(projectPath);

		console.log(chalk.cyan("\n📋 Project name:"), projectName);
		console.log(chalk.cyan("📁 Project path:"), projectPath);

		//? check if directory exists and is not empty
		const isEmpty = await isDirectoryEmpty(projectPath);
		if (!isEmpty) {
			const { proceed } = await inquirer.prompt([
				{
					type: "confirm",
					name: "proceed",
					message:
						"⚠️  The directory is not empty. Would you like to clear its contents?",
					default: false,
				},
			]);
			if (!proceed) {
				console.log(chalk.yellow("⚠️  Operation cancelled"));
				process.exit(0);
			}
			await deleteDirectoryContents(projectPath);
		}

		const answers = await promptSetupFlow(options);
		const projectConfig = convertAnswersToConfig(answers, projectName);

		console.log(chalk.cyan("\n🔍 Project configuration:"), projectConfig);

		//? do i even need to check if base template exists?
		// const baseTemplatePath = path.join(templatesDir, "base");
		// const isBaseValid = await validateTemplate(baseTemplatePath);
		// if (!isBaseValid) {
		//     throw new Error("Base turbo-repo template not found!");
		// }

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
