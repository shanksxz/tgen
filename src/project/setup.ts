import path from "node:path";
import chalk from "chalk";
import inquirer from "inquirer";
import { templatesDir } from "../helper/constant";
import { getAvailableTemplates } from "../helper/validator";
import type { ProjectConfig } from "../types";
import {
	copyTemplate,
	initGit,
	installDependencies,
	setupDatabase,
} from "../utils/template";

export class ProjectSetup {
	private projectPath: string;
	private projectName: string;
	private projectConfig: ProjectConfig;

	constructor(
		projectPath: string,
		projectName: string,
		projectConfig: ProjectConfig,
	) {
		this.projectPath = projectPath;
		this.projectName = projectName;
		this.projectConfig = projectConfig;
	}

	public async setupProject() {
		try {
			await this.setupBaseStructure();
			await this.setupDatabaseIfNeeded();
			await this.setupApps();
			await this.initializeGitIfNeeded();
			await this.installDependenciesIfNeeded();
			this.displayNextSteps();
		} catch (error) {
			console.error(
				chalk.red("❌ Error setting up project:"),
				error instanceof Error ? error.message : "Unknown error occurred",
			);
			throw error;
		}
	}

	private async setupBaseStructure() {
		console.log(chalk.yellow("\n⚙️  Setting up turbo-repo structure..."));
		const baseTemplatePath = path.join(templatesDir, "base");
		await copyTemplate(baseTemplatePath, this.projectPath, this.projectConfig);
		console.log(chalk.green("✓ Base turbo-repo structure created"));
	}

	private async setupDatabaseIfNeeded() {
		if (!this.projectConfig.drizzle && !this.projectConfig.prisma) return;

		console.log(chalk.yellow("\n🗄️  Setting up database..."));
		await setupDatabase(this.projectConfig, this.projectPath);
		console.log(chalk.green("✓ Database setup complete"));
	}

	private async initializeGitIfNeeded() {
		if (this.projectConfig.skipGit) return;

		console.log(chalk.yellow("\n📦 Initializing git repository..."));
		await initGit(this.projectPath);
		console.log(chalk.green("✓ Git repository initialized"));
	}

	private async installDependenciesIfNeeded() {
		if (this.projectConfig.skipInstall) return;

		const packageManager = this.projectConfig.pnpm
			? "pnpm"
			: this.projectConfig.npm
				? "npm"
				: "bun";
		console.log(
			chalk.yellow(`\n📦 Installing dependencies using ${packageManager}...`),
		);
		await installDependencies(this.projectPath, this.projectConfig);
		console.log(chalk.green("✓ Dependencies installed"));
	}

	private async setupApps() {
		const appsPath = path.join(templatesDir, "apps");
		const availableApps = await getAvailableTemplates(appsPath);

		if (availableApps.length > 0) {
			const { addApps } = await inquirer.prompt([
				{
					type: "confirm",
					name: "addApps",
					message: "🚀 Would you like to add any apps to your workspace?",
					default: true,
				},
			]);

			if (addApps) {
				//TODO: what if user wants to add multiple apps?
				const { app } = await inquirer.prompt([
					{
						type: "list",
						name: "app",
						message: "Select apps to add:",
						choices: availableApps,
					},
				]);
				console.log(chalk.yellow(`\n📦 Adding app: ${app}`));
				const appTemplatePath = path.join(appsPath, app);
				const appTargetPath = path.join(this.projectPath, "apps", app);
				await copyTemplate(appTemplatePath, appTargetPath, this.projectConfig);
				console.log(chalk.green(`✓ App ${app} added`));
			}
		}
	}

	//TODO: implement this
	// private async setupPackages() {
	//     const packagesPath = path.join(templatesDir, "packages");
	//     const availablePackages = await getAvailableTemplates(packagesPath);

	//     if (availablePackages.length > 0) {
	//         const { addPackages } = await inquirer.prompt([
	//             {
	//                 type: 'confirm',
	//                 name: 'addPackages',
	//                 message: '📦 Would you like to add any packages to your workspace?',
	//                 default: true
	//             },
	//         ]);

	//         if (addPackages) {
	//             const { selectedPackages } = await inquirer.prompt([
	//                 {
	//                     type: 'checkbox',
	//                     name: 'selectedPackages',
	//                     message: 'Select packages to add:',
	//                     choices: availablePackages.filter(p => p !== 'database')
	//                 },
	//             ]);

	//             for (const pkg of selectedPackages) {
	//                 console.log(chalk.yellow(`\n📦 Adding package: ${pkg}`));
	//                 const pkgTemplatePath = path.join(packagesPath, pkg);
	//                 const pkgTargetPath = path.join(this.projectPath, "packages", pkg);
	//                 await copyTemplate(pkgTemplatePath, pkgTargetPath, this.projectConfig);
	//                 console.log(chalk.green(`✓ Package ${pkg} added`));
	//             }
	//         }
	//     }
	// }

	private displayNextSteps() {
		const packageManager = this.projectConfig.pnpm
			? "pnpm"
			: this.projectConfig.npm
				? "npm"
				: "bun";

		console.log(chalk.green("\n✅ Turbo-repo project generated successfully!"));
		console.log(chalk.cyan("\n📝 Next steps:"));
		console.log(chalk.white(`  cd ${this.projectName}`));

		if (!this.projectConfig.skipInstall) {
			console.log(
				chalk.white(`  ${packageManager} dev     # Start development server`),
			);
		} else {
			console.log(
				chalk.white(`  ${packageManager} install  # Install dependencies`),
			);
			console.log(
				chalk.white(`  ${packageManager} dev     # Start development server`),
			);
		}
	}
}

export const setupProject = async (
	projectPath: string,
	projectName: string,
	projectConfig: ProjectConfig,
) => {
	const setup = new ProjectSetup(projectPath, projectName, projectConfig);
	await setup.setupProject();
};
