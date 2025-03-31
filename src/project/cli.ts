import { Command } from "commander";

export const createCliProgram = () => {
	return new Command()
		.name("tgen")
		.description("A CLI tool to manage your turbo-repo projects")
		.argument(
			"[dir]",
			"The directory for the project (default: current directory)",
			".",
		)
		.option("--husky", "Include husky", false)
		.option("--install", "Install dependencies", true)
		.option("--skip-install", "Skip installing dependencies", false)
		.option("--skip-git", "Skip git initialization", false);
};
