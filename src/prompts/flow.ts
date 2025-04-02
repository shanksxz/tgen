import inquirer from "inquirer";
import type { ProjectConfig } from "../types";

export type PromptAnswers = {
	frontend: string[];
	//TODO: add backend options
	//   backend: string;
	// runtime: string;
	database: "postgres" | "sqlite" | "mysql";
	orm: "drizzle" | "prisma";
	auth: "better-auth" | "next-auth" | "none";
	//TODO: add addons options
	// addons: string[];
	// examples: string[];
	initGit: boolean;
	// packageManager: "pnpm" | "npm" | "bun";
	installDeps: boolean;
	//? idk if this is needed
	//   typescript: boolean;
	husky: boolean;
};

export const promptSetupFlow = async (options: {
	skipGit?: boolean;
	skipInstall?: boolean;
	install?: boolean;
	husky?: boolean;
}): Promise<PromptAnswers> => {
	const answers = await inquirer.prompt([
		{
			type: "checkbox",
			name: "frontend",
			message: "Which frontend applications would you like to create?",
			choices: [
				{ name: "Web App (Next.js)", value: "nextjs" },
				{ name: "React SPA", value: "react" },
				{ name: "T3 App", value: "t3" },
			],
			default: ["nextjs"],
		},
		//TODO: add backend options
		// {
		//   type: "list",
		//   name: "backend",
		//   message: "Which backend framework would you like to use?",
		//   choices: [
		//     { name: "Hono", value: "hono" },
		//     { name: "Express", value: "express" },
		//     { name: "Fastify", value: "fastify" },
		//     { name: "None", value: "none" }
		//   ],
		//   default: "hono"
		// },
		// {
		// 	type: "list",
		// 	name: "runtime",
		// 	message: "Which runtime would you like to use?",
		// 	choices: [
		// 		{ name: "Node.js", value: "node" },
		// 		{ name: "Bun", value: "bun" },
		// 		{ name: "Deno", value: "deno" },
		// 	],
		// 	default: "node",
		// 	//   when: (answers) => answers.backend !== "none"
		// },

		{
			type: "list",
			name: "database",
			message: "Which database would you like to use?",
			choices: [
				{ name: "PostgreSQL", value: "postgres" },
				{ name: "SQLite", value: "sqlite" },
				{ name: "MySQL", value: "mysql" },
				{ name: "None", value: "none" },
			],
			default: "postgres",
		},
		{
			type: "list",
			name: "orm",
			message: "Which ORM would you like to use?",
			choices: [
				{ name: "Drizzle", value: "drizzle" },
				{ name: "Prisma", value: "prisma" },
			],
			default: "drizzle",
			when: (answers) => answers.database !== "none",
		},
		{
			type: "list",
			name: "auth",
			message: "Which authentication solution would you like to use?",
			choices: [
				{ name: "Better-Auth", value: "better-auth" },
				{ name: "Next-Auth", value: "next-auth" },
				{ name: "None", value: "none" },
			],
			default: "better-auth",
			when: (answers) => answers.database !== "none",
		},
		//TODO: add addons options
		// {
		//   type: "checkbox",
		//   name: "addons",
		//   message: "Which addons would you like to add?",
		//   choices: [
		//     { name: "UI Package", value: "ui" },
		//     { name: "API Client Package", value: "api-client" },
		//     { name: "Logger Package", value: "logger" },
		//     { name: "Config Package", value: "config" }
		//   ],
		//   default: []
		// },
		//TODO: add examples options
		// {
		//   type: "checkbox",
		//   name: "examples",
		//   message: "Which examples would you like to include?",
		//   choices: [
		//     { name: "Authentication", value: "auth" },
		//     { name: "Form Handling", value: "forms" },
		//     { name: "API Integration", value: "api" },
		//     { name: "Database CRUD", value: "crud" }
		//   ],
		//   default: []
		// },
		{
			type: "confirm",
			name: "initGit",
			message: "Initialize a new git repository?",
			default: !options.skipGit,
			when: !options.skipGit,
		},
		// {
		//   type: "list",
		//   name: "packageManager",
		//   message: "Which package manager do you want to use?",
		//   choices: [
		//     { name: "pnpm (Recommended)", value: "pnpm" },
		//     { name: "npm", value: "npm" },
		//     { name: "bun", value: "bun" }
		//   ],
		//   default: "pnpm"
		// },
		{
			type: "confirm",
			name: "installDeps",
			message: "Do you want to install project dependencies?",
			default: options.install !== false,
			when: !options.skipInstall,
		},
		//? idk if this is needed
		// {
		//   type: "confirm",
		//   name: "typescript",
		//   message: "Use TypeScript? (Recommended)",
		//   default: true
		// },
		//? husky setup (only if git is initialized)
		{
			type: "confirm",
			name: "husky",
			message: "Set up Husky for git hooks?",
			default: options.husky ?? false,
			when: (answers) =>
				answers.initGit || (!options.skipGit && options.skipGit === undefined),
		},
	]);

	return {
		...answers,
		initGit: options.skipGit ? false : (answers.initGit ?? false),
		installDeps: options.skipInstall
			? false
			: (answers.installDeps ?? options.install !== false),
		frontend: answers.frontend || [],
		// addons: answers.addons || [],
		// examples: answers.examples || []
	};
};

export const convertAnswersToConfig = (
	answers: PromptAnswers,
	projectName: string,
): ProjectConfig => {
	return {
		name: projectName,
		template: "base",
		database: answers.database as "postgres" | "sqlite" | "mysql",
		husky: answers.husky,
		npm: false,
		pnpm: false,
		bun: false,
		drizzle: answers.orm === "drizzle",
		prisma: answers.orm === "prisma",
		install: answers.installDeps,
		skipInstall: !answers.installDeps,
		skipGit: !answers.initGit,
		turbo: true,
		frontend: answers.frontend,
		// backend: answers.backend,
		// runtime: answers.runtime,
		auth: answers.auth,
		// addons: answers.addons,
		// examples: answers.examples,
		// typescript: answers.typescript
	};
};
