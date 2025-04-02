import path from "node:path";
import chalk from "chalk";
import { addPackageDependencies } from "../helper/add-deps";
import { templatesDir } from "../helper/constant";
import type { ProjectConfig } from "../types";
import { getTemplatePath } from "../types/templates";
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
			await this.setupFrontendApps();
			//TODO: implement this later
			// await this.setupBackend();
			await this.setupDatabaseIfNeeded();
			await this.setupAuthIfNeeded();
			await this.setupAddons();
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

	private async setupFrontendApps() {
		if (
			!this.projectConfig.frontend ||
			this.projectConfig.frontend.length === 0
		)
			return;

		console.log(chalk.yellow("\n🚀 Setting up frontend applications..."));

		for (const app of this.projectConfig.frontend) {
			console.log(chalk.yellow(`\n📱 Adding ${app} application...`));
			const appPath = getTemplatePath({ frontend: [app] }, "app");
			if (!appPath) continue;

			const appTemplatePath = path.join(templatesDir, appPath);
			const appTargetPath = path.join(this.projectPath, "apps", app);
			await copyTemplate(appTemplatePath, appTargetPath, this.projectConfig);
			console.log(chalk.green(`✓ ${app} application added`));
		}
	}

	//TODO: implement this later
	// private async setupBackend() {
	// 	if (!this.projectConfig.backend || this.projectConfig.backend === "none") return;

	// 	console.log(chalk.yellow(`\n🔌 Setting up ${this.projectConfig.backend} backend...`));
	// 	const serverPath = getTemplatePath({ backend: this.projectConfig.backend }, "server");
	// 	if (!serverPath) return;

	// 	const serverTemplatePath = path.join(templatesDir, serverPath);
	// 	const serverTargetPath = path.join(this.projectPath, "apps", "api");
	// 	await copyTemplate(serverTemplatePath, serverTargetPath, this.projectConfig);
	// 	console.log(chalk.green(`✓ ${this.projectConfig.backend} backend added`));
	// }

	private async setupDatabaseIfNeeded() {
		if (
			(!this.projectConfig.drizzle && !this.projectConfig.prisma) ||
			this.projectConfig.database === "none"
		)
			return;

		console.log(chalk.yellow("\n🗄️  Setting up database..."));
		await setupDatabase(this.projectConfig, this.projectPath);
		console.log(chalk.green("✓ Database setup complete"));
	}

	private async setupAuthIfNeeded() {
		if (
			!this.projectConfig.auth ||
			this.projectConfig.auth === "none" ||
			this.projectConfig.database === "none"
		)
			return;

		console.log(chalk.yellow(`\n🔑 Setting up ${this.projectConfig.auth}...`));
		const authPath = getTemplatePath(
			{
				auth: this.projectConfig.auth,
				orm: this.projectConfig.drizzle ? "drizzle" : "prisma",
				database: this.projectConfig.database,
			},
			"auth",
		);

		if (!authPath) return;

		const authTemplatePath = path.join(templatesDir, authPath);

		// if nextjs/t3 is selected, set up auth in the nextjs/t3 app directory
		if (
			this.projectConfig.frontend?.includes("nextjs") ||
			this.projectConfig.frontend?.includes("t3")
		) {
			const appName = this.projectConfig.frontend?.includes("nextjs")
				? "nextjs"
				: "t3";
			const appPath = path.join(this.projectPath, "apps", appName);
			const authTargetPath = path.join(appPath, "server", "auth");

			await copyTemplate(authTemplatePath, authTargetPath, this.projectConfig);
			addPackageDependencies(appPath, {
				dependencies: ["better-auth"],
			});
		} else {
			//? idk if i even need to setup auth in the packages directory
			return;
			// const authTargetPath = path.join(this.projectPath, "packages", "auth");
			// await copyTemplate(authTemplatePath, authTargetPath, this.projectConfig);
		}

		console.log(chalk.green(`✓ ${this.projectConfig.auth} setup complete`));
	}

	private async setupAddons() {
		if (!this.projectConfig.addons || this.projectConfig.addons.length === 0)
			return;

		console.log(chalk.yellow("\n📦 Setting up addons..."));

		for (const addon of this.projectConfig.addons) {
			console.log(chalk.yellow(`\n🧩 Adding ${addon} package...`));
			const addonTemplatePath = path.join(templatesDir, "packages", addon);
			const addonTargetPath = path.join(this.projectPath, "packages", addon);
			await copyTemplate(
				addonTemplatePath,
				addonTargetPath,
				this.projectConfig,
			);
			console.log(chalk.green(`✓ ${addon} package added`));
		}
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
