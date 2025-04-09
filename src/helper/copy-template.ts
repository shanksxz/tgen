import fs from "node:fs/promises";
import path from "node:path";
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
