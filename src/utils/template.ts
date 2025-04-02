import { execSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import chalk from "chalk";
import { templatesDir } from "../helper/constant";
import type { ProjectConfig } from "../types";

export const copyTemplate = async (
	templatePath: string,
	targetPath: string,
	config: ProjectConfig,
): Promise<void> => {
	try {
		await fs.mkdir(targetPath, { recursive: true });
		const entries = await fs.readdir(templatePath, { withFileTypes: true });
		for (const entry of entries) {
			const srcPath = path.join(templatePath, entry.name);
			const destPath = path.join(targetPath, entry.name);
			if (entry.isDirectory()) {
				//? skip node_modules directory
				if (entry.name === "node_modules") {
					continue;
				}
				await copyTemplate(srcPath, destPath, config);
			} else {
				if (entry.name.endsWith(".template")) {
					const content = await fs.readFile(srcPath, "utf-8");
					//TODO: currently not processing the template content
					//TODO: have to re-think about this
					// const processed = processTemplateContent(content, config);
					await fs.writeFile(destPath.replace(".template", ""), content);
				} else {
					await fs.copyFile(srcPath, destPath);
				}
			}
		}
	} catch (error) {
		throw new Error(
			`Failed to copy template: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
};

//TODO: ai generated code, need to refactor
// const processTemplateContent = (
// 	content: string,
// 	config: ProjectConfig,
// ): string => {
// 	return content
// 		.replace(/\{\{name\}\}/g, config.name)
// 		.replace(/\{\{#if husky\}\}([\s\S]*?)\{\{\/if\}\}/g, (_, block) =>
// 			config.husky ? block : "",
// 		)
// 		.replace(/\{\{#if drizzle\}\}([\s\S]*?)\{\{\/if\}\}/g, (_, block) =>
// 			config.drizzle ? block : "",
// 		)
// 		.replace(/\{\{#if prisma\}\}([\s\S]*?)\{\{\/if\}\}/g, (_, block) =>
// 			config.prisma ? block : "",
// 		);
// };

export const setupDatabase = async (
	config: ProjectConfig,
	projectPath: string,
): Promise<void> => {
	if (!config.drizzle && !config.prisma) return;
	try {
		if (config.drizzle) {
			const drizzleTemplatePath = path.join(
				templatesDir,
				"packages",
				"database",
				"drizzle",
				`drizzle-${config.database}`,
			);
			const targetPath = path.join(projectPath, "packages", "database");
			await copyTemplate(drizzleTemplatePath, targetPath, config);
			const dbScriptPath = path.join(templatesDir, "start-database");
			const scriptsTargetPath = path.join(projectPath, "scripts");
			try {
				await fs.access(dbScriptPath);
				await copyTemplate(dbScriptPath, scriptsTargetPath, config);
			} catch (error) {
				console.log(
					chalk.yellow("⚠️  Database startup scripts not found, skipping..."),
				);
			}
		}
		if (config.prisma) {
			const prismaTemplatePath = path.join(
				templatesDir,
				"packages",
				"database",
				"prisma",
				`prisma-${config.database}`,
			);

			const targetPath = path.join(projectPath, "packages", "database");
			await copyTemplate(prismaTemplatePath, targetPath, config);
		}
	} catch (error) {
		throw new Error(
			`Failed to setup database: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
};

export const installDependencies = async (
	projectPath: string,
	config: ProjectConfig,
): Promise<void> => {
	if (config.skipInstall) return;

	const cwd = { cwd: projectPath };

	try {
		if (config.pnpm) {
			execSync("pnpm install", cwd);
		} else if (config.npm) {
			execSync("npm install", cwd);
		} else if (config.bun) {
			execSync("bun install", cwd);
		}
	} catch (error) {
		throw new Error("Failed to install dependencies");
	}
};

export const initGit = async (projectPath: string): Promise<void> => {
	try {
		execSync("git init", { cwd: projectPath });
		execSync("git add .", { cwd: projectPath });
		execSync('git commit -m "Initial commit"', { cwd: projectPath });
	} catch (error) {
		throw new Error("Failed to initialize git repository");
	}
};
