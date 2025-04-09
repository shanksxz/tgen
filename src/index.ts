import path from "node:path";
import process from "node:process";
import * as p from "@clack/prompts";
import chalk from "chalk";
import { createCliProgram } from "./project/cli";
import { promptSetupFlowWithClack } from "./project/flow";
import { setupProject } from "./project/setup";
import { deleteDirectoryContents, isDirectoryEmpty } from "./utils/validator";

const runCli = async () => {
	try {
		const program = createCliProgram().parse();

		//TODO: add options support
		// const options = program.opts();
		//TODO: currently only supports current directory
		const directory = program.args[0] || ".";

		const projectPath = path.resolve(process.cwd(), directory);
		const projectName =
			directory === "."
				? path.basename(process.cwd())
				: path.basename(projectPath);

		p.intro(chalk.bold(chalk.blue("🚀 Initializing turbo-repo project...")));
		p.log.info(chalk.cyan(`📋 Project name: ${projectName}`));
		p.log.info(chalk.cyan(`📁 Project path: ${projectPath}`));

		//? check if directory exists and is not empty
		const isEmpty = await isDirectoryEmpty(projectPath);
		if (!isEmpty) {
			const proceed = await p.confirm({
				message:
					"⚠️  The directory is not empty. Would you like to clear its contents?",
				initialValue: false,
			});

			if (p.isCancel(proceed) || !proceed) {
				p.cancel("Operation cancelled");
				process.exit(0);
			}

			const s = p.spinner();
			s.start("Clearing directory contents...");
			await deleteDirectoryContents(projectPath);
			s.stop("Directory cleared");
		}

		const projectConfig = await promptSetupFlowWithClack(projectName);

		p.log.info(chalk.cyan("\n🔍 Project configuration:"));
		for (const [key, value] of Object.entries(projectConfig)) {
			if (value !== undefined && value !== false) {
				p.log.info(
					`  ${chalk.green(key)}: ${chalk.white(JSON.stringify(value))}`,
				);
			}
		}

		const s = p.spinner();
		s.start("Setting up your project...");
		await setupProject(projectPath, projectName, projectConfig);

		s.stop("Project setup complete!");
		p.outro(chalk.green("✨ Your turbo-repo project is ready! Happy coding!"));
	} catch (error) {
		p.log.error(
			chalk.red(
				`\n❌ Error: ${error instanceof Error ? error.message : String(error)}`,
			),
		);
		process.exit(1);
	}
};

runCli();
