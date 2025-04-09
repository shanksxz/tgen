import { execSync } from "node:child_process";

export const initGit = async (projectPath: string): Promise<void> => {
	try {
		execSync("git init", { cwd: projectPath });
		execSync("git add .", { cwd: projectPath });
		execSync('git commit -m "Initial commit"', { cwd: projectPath });
	} catch (error) {
		throw new Error("Failed to initialize git repository");
	}
};
