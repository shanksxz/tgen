import fs from "node:fs/promises";
import path from "node:path";
import chalk from "chalk";

export const validateTemplate = async (
	templatePath: string,
): Promise<boolean> => {
	try {
		await fs.access(templatePath);
		return true;
	} catch (error) {
		return false;
	}
};

export const getAvailableTemplates = async (
	templatePath: string,
): Promise<string[]> => {
	try {
		const entries = await fs.readdir(templatePath, { withFileTypes: true });
		return entries
			.filter((entry) => entry.isDirectory())
			.map((entry) => entry.name);
	} catch (error) {
		console.error(chalk.yellow("⚠️ Could not read templates directory:"), error);
		return [];
	}
};

export const isDirectoryEmpty = async (dirPath: string): Promise<boolean> => {
	try {
		const entries = await fs.readdir(dirPath);
		return entries.length === 0;
	} catch (error) {
		if (error instanceof Error && "code" in error && error.code === "ENOENT") {
			// directory doesn't exist, so it's technically "empty"
			return true;
		}
		console.error(
			chalk.yellow("⚠️ Error checking if directory is empty:"),
			error,
		);
		return false;
	}
};

export const deleteDirectory = async (dirPath: string): Promise<void> => {
	try {
		await fs.rm(dirPath, { recursive: true, force: true });
	} catch (error) {
		console.error(chalk.red("❌ Error deleting directory:"), error);
		throw error;
	}
};

export const deleteDirectoryContents = async (
	dirPath: string,
): Promise<void> => {
	try {
		const entries = await fs.readdir(dirPath);
		for (const entry of entries) {
			await fs.rm(path.join(dirPath, entry), { recursive: true, force: true });
		}
	} catch (error) {
		console.error(chalk.red("❌ Error deleting directory contents:"), error);
		throw error;
	}
};

export const isDirectoryExists = async (dirPath: string): Promise<boolean> => {
	try {
		await fs.access(dirPath);
		return true;
	} catch (error) {
		return false;
	}
};
