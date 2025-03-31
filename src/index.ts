import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import chalk from "chalk";
import { Command } from "commander";
import inquirer from "inquirer";
import type { ProjectConfig, TemplateType } from "./types";
import {
	copyTemplate,
	initGit,
	installDependencies,
	setupDatabase,
} from "./utils/template";

const validateTemplate = async (templatePath: string): Promise<boolean> => {
	try {
		await fs.access(templatePath);
		return true;
	} catch {
		return false;
	}
};

const getAvailableTemplates = async (
	templatePath: string,
): Promise<string[]> => {
	try {
		const entries = await fs.readdir(templatePath, { withFileTypes: true });
		return entries
			.filter((entry) => entry.isDirectory())
			.map((entry) => entry.name);
	} catch {
		return [];
	}
};

const runCli = async () => {
	const program = new Command()
		.name("tgen")
		.description("A CLI tool to manage your turbo-repo projects")
		.argument(
			"[dir]",
			"The directory for the project (default: current directory)",
			".",
		)
		.option(
			"-d, --database <type>",
			"Database type (postgres/sqlite/mysql)",
			"postgres",
		)
		.option("--husky", "Include husky", false)
		.option("--drizzle", "Use drizzle", true)
		.option("--prisma", "Use prisma", false)
		.option("--install", "Install dependencies", true)
		.option("--skip-install", "Skip installing dependencies", false)
		.option("--skip-git", "Skip git initialization", false)
		.parse();

	try {
		console.log(chalk.blue("🚀 Initializing turbo-repo project..."));
		const options = program.opts();
		const directory = program.args[0];

		const projectPath = path.resolve(process.cwd(), directory);
		const projectName =
			directory === "."
				? path.basename(process.cwd())
				: path.basename(projectPath);

		const baseTemplatePath = path.join(__dirname, "..", "templates", "base");
		const isBaseValid = await validateTemplate(baseTemplatePath);
		if (!isBaseValid) {
			throw new Error("Base turbo-repo template not found!");
		}

		const projectConfig: ProjectConfig = {
			name: projectName,
			template: "base",
			database: options.database as "postgres" | "sqlite" | "mysql",
			husky: options.husky,
			npm: false,
			pnpm: true,
			bun: false,
			drizzle: options.drizzle,
			prisma: options.prisma,
			install: options.install,
			skipInstall: options.skipInstall,
			skipGit: options.skipGit,
			turbo: true,
		};

		console.log(chalk.cyan("\n📋 Project Configuration:"));
		console.log(chalk.cyan("📁 Project Path:"), projectPath);
		console.log(chalk.cyan("📝 Project Name:"), projectName);

		console.log(chalk.yellow("\n⚙️  Setting up turbo-repo structure..."));
		await copyTemplate(baseTemplatePath, projectPath, projectConfig);
		console.log(chalk.green("✓ Base turbo-repo structure created"));

		const appsPath = path.join(__dirname, "..", "templates", "apps");
		const packagesPath = path.join(__dirname, "..", "templates", "packages");
		const availableApps = await getAvailableTemplates(appsPath);
		const availablePackages = await getAvailableTemplates(packagesPath);

		if (availableApps.length > 0) {
			const { addApps } = await inquirer.prompt([
				{
					type: "confirm",
					name: "addApps",
					message: "Would you like to add any apps to your workspace?",
					default: true,
				},
			]);

			if (addApps) {
				const { selectedApps } = await inquirer.prompt([
					{
						type: "checkbox",
						name: "selectedApps",
						message: "Select apps to add:",
						choices: availableApps,
					},
				]);

				for (const app of selectedApps) {
					console.log(chalk.yellow(`\n📦 Adding app: ${app}`));
					const appTemplatePath = path.join(appsPath, app);
					const appTargetPath = path.join(projectPath, "apps", app);
					await copyTemplate(appTemplatePath, appTargetPath, projectConfig);
					console.log(chalk.green(`✓ App ${app} added`));
				}
			}
		}

		if (availablePackages.length > 0) {
			const { addPackages } = await inquirer.prompt([
				{
					type: "confirm",
					name: "addPackages",
					message: "Would you like to add any packages to your workspace?",
					default: true,
				},
			]);

			if (addPackages) {
				const { selectedPackages } = await inquirer.prompt([
					{
						type: "checkbox",
						name: "selectedPackages",
						message: "Select packages to add:",
						choices: availablePackages,
					},
				]);

				for (const pkg of selectedPackages) {
					console.log(chalk.yellow(`\n📦 Adding package: ${pkg}`));
					const pkgTemplatePath = path.join(packagesPath, pkg);
					const pkgTargetPath = path.join(projectPath, "packages", pkg);
					await copyTemplate(pkgTemplatePath, pkgTargetPath, projectConfig);
					console.log(chalk.green(`✓ Package ${pkg} added`));
				}
			}
		}

		if (projectConfig.drizzle || projectConfig.prisma) {
			console.log(chalk.yellow("\n🗄️  Setting up database..."));
			await setupDatabase(projectConfig, projectPath);
			console.log(chalk.green("✓ Database setup complete"));
		}

		if (!projectConfig.skipGit) {
			console.log(chalk.yellow("\n📦 Initializing git repository..."));
			await initGit(projectPath);
			console.log(chalk.green("✓ Git repository initialized"));
		}

		if (!projectConfig.skipInstall) {
			console.log(chalk.yellow("\n📦 Installing dependencies..."));
			await installDependencies(projectPath, projectConfig);
			console.log(chalk.green("✓ Dependencies installed"));
		}

		console.log(chalk.green("\n✅ Turbo-repo project generated successfully!"));

		console.log(chalk.cyan("\n📝 Next steps:"));
		console.log(chalk.white(`  cd ${projectName}`));
		if (!projectConfig.skipInstall) {
			console.log(chalk.white("  pnpm dev     # Start development server"));
		} else {
			console.log(chalk.white("  pnpm install  # Install dependencies"));
			console.log(chalk.white("  pnpm dev     # Start development server"));
		}
	} catch (error) {
		console.log(
			chalk.red("\n❌ Error:"),
			error instanceof Error ? error.message : "An unknown error occurred",
		);
		process.exit(1);
	}
};

runCli();
