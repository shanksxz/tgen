import { execSync } from "node:child_process";
import type { ProjectConfig } from "../types";

export const installDependencies = async (
	projectPath: string,
	config: ProjectConfig,
): Promise<void> => {
	if (config.skipInstall) return;

	const cwd = { cwd: projectPath };

	try {
		//TODO: need to add support for other package managers
		// if (config.pnpm) {
		// 	execSync("pnpm install", cwd);
		// } else if (config.npm) {
		// 	execSync("npm install", cwd);
		// } else if (config.bun) {
		// 	execSync("bun install", cwd);
		// }
		execSync("pnpm install", cwd);
	} catch (error) {
		throw new Error("Failed to install dependencies");
	}
};
