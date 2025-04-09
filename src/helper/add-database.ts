import fs from "node:fs/promises";
import path from "node:path";
import chalk from "chalk";
import type { ProjectConfig } from "../types";
import { templatesDir } from "../utils/constant";
import { copyTemplate } from "./copy-template";

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
