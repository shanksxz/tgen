import * as p from "@clack/prompts";
import {
	confirm,
	intro,
	isCancel,
	multiselect,
	outro,
	select,
	text,
} from "@clack/prompts";
import chalk from "chalk";
import type { ProjectConfig } from "../types";

const handleCancel = () => {
	p.cancel("Setup cancelled.");
	process.exit(0);
};

export const promptSetupFlowWithClack = async (
	predefinedProjectName?: string,
): Promise<ProjectConfig> => {
	intro(chalk.bold(chalk.cyan("Turbo-repo Generator CLI")));
	p.log.info(chalk.yellow("Let's set up your new turbo-repo project!"));

	let projectName = predefinedProjectName;
	if (!projectName) {
		const namePrompt = await text({
			message: "What's the name of your project?",
			placeholder: "my-turbo-repo",
			validate: (value) => {
				if (!value) return "Project name is required";
				if (!/^[a-z0-9-_]+$/.test(value))
					return "Project name can only contain lowercase letters, numbers, hyphens, and underscores";
				return undefined;
			},
		});

		if (isCancel(namePrompt)) handleCancel();
		projectName = namePrompt as string;
	}

	const frontendSelection = await multiselect({
		message: "Select frontend application(s): ",
		options: [
			{ label: "Next.js", value: "nextjs" },
			{ label: "React", value: "react" },
			{ label: "T3 Stack", value: "t3" },
		],
		required: false,
		initialValues: ["nextjs"],
	});

	if (isCancel(frontendSelection)) handleCancel();
	const frontend = frontendSelection as string[];

	// TODO: might be in future
	// const backendSelection = await select({
	//     message: "Select a backend framework:",
	//     options: [
	//         { label: "None", value: "none" },
	//         { label: "Hono", value: "hono" },
	//         { label: "Express", value: "express" },
	//         { label: "Fastify", value: "fastify" },
	//     ],
	//     initialValue: "none",
	// });

	// if (isCancel(backendSelection)) handleCancel();
	// const backend = backendSelection as string;

	// const runtimeSelection = await select({
	//     message: "Select a runtime:",
	//     options: [
	//         { label: "Node.js", value: "node" },
	//         { label: "Bun", value: "bun" },
	//         { label: "Deno", value: "deno" },
	//     ],
	//     initialValue: "node",
	// });

	// if (isCancel(runtimeSelection)) handleCancel();
	// const runtime = runtimeSelection as string;

	const databaseSelection = await select({
		message: "Select a database:",
		options: [
			{ label: "None", value: "none" },
			{ label: "PostgreSQL", value: "postgres" },
			{ label: "SQLite", value: "sqlite" },
			{ label: "MySQL", value: "mysql" },
		],
		initialValue: "none",
	});

	if (isCancel(databaseSelection)) handleCancel();
	const database = databaseSelection as
		| "postgres"
		| "sqlite"
		| "mysql"
		| "none";

	let prisma = false;
	let drizzle = false;

	if (database !== "none") {
		const ormSelection = await select({
			message: "Select an ORM:",
			options: [
				{ label: "Drizzle", value: "drizzle" },
				{ label: "Prisma", value: "prisma" },
			],
			initialValue: "drizzle",
		});

		if (isCancel(ormSelection)) handleCancel();
		const orm = ormSelection as string;

		prisma = orm === "prisma";
		drizzle = orm === "drizzle";
	}

	let auth: "better-auth" | "next-auth" | "none" = "none";
	if (database !== "none") {
		const authSelection = await select({
			message: "Select an authentication provider:",
			options: [
				{
					label: "Better Auth (recommended && only for Next.js)",
					value: "better-auth",
				},
				{ label: "Next Auth (only for Next.js)", value: "next-auth" },
				{ label: "None", value: "none" },
			],
			initialValue: "none",
		});

		if (isCancel(authSelection)) handleCancel();
		auth = authSelection as "better-auth" | "next-auth" | "none";
	}

	// const addonsSelection = await multiselect({
	//     message: "Select addons:",
	//     options: [
	//         { label: "UI Components", value: "ui" },
	//         { label: "API Client", value: "api" },
	//         { label: "Logger", value: "logger" },
	//         { label: "Config", value: "config" },
	//     ],
	//     required: false,
	// });

	// if (isCancel(addonsSelection)) handleCancel();
	// const addons = addonsSelection as string[];

	// const examplesSelection = await multiselect({
	//     message: "Include examples for:",
	//     options: [
	//         { label: "Authentication", value: "auth" },
	//         { label: "Form validation", value: "forms" },
	//         { label: "API routes", value: "api" },
	//     ],
	//     required: false,
	// });

	// if (isCancel(examplesSelection)) handleCancel();
	// const examples = examplesSelection as string[];

	// const packageManagerSelection = await select({
	//     message: "Select a package manager:",
	//     options: [
	//         { label: "npm", value: "npm" },
	//         { label: "pnpm", value: "pnpm" },
	//         { label: "bun", value: "bun" },
	//     ],
	//     initialValue: "pnpm",
	// });

	// if (isCancel(packageManagerSelection)) handleCancel();
	// const packageManager = packageManagerSelection as string;

	const skipGitSelection = await confirm({
		message: "Skip Git initialization?",
		initialValue: false,
	});

	if (isCancel(skipGitSelection)) handleCancel();
	const skipGit = skipGitSelection === true;

	const skipInstallSelection = await confirm({
		message: "Skip installing dependencies?",
		initialValue: false,
	});

	if (isCancel(skipInstallSelection)) handleCancel();
	const skipInstall = skipInstallSelection === true;

	const huskySelection = await confirm({
		message: "Include Husky for Git hooks?",
		initialValue: true,
	});

	if (isCancel(huskySelection)) handleCancel();
	const husky = huskySelection === true;

	p.note(
		chalk.green(`Here's your configuration:\n
• Project Name: ${chalk.cyan(projectName)}
• Frontend: ${chalk.cyan(frontend.length ? frontend.join(", ") : "None")}
• Database: ${chalk.cyan(database)}
• ORM: ${chalk.cyan(drizzle ? "Drizzle" : prisma ? "Prisma" : "None")}
• Auth: ${chalk.cyan(auth)}
• Skip Git: ${chalk.cyan(skipGit ? "Yes" : "No")}
• Skip Install: ${chalk.cyan(skipInstall ? "Yes" : "No")}
• Husky: ${chalk.cyan(husky ? "Yes" : "No")}
`),
		"Configuration Summary",
	);

	const confirmSelection = await confirm({
		message: "Proceed with this configuration?",
		initialValue: true,
	});

	if (isCancel(confirmSelection) || confirmSelection !== true) {
		p.cancel("Setup cancelled.");
		process.exit(0);
	}

	const config: ProjectConfig = {
		name: projectName as string,
		template: "app",
		husky,
		// npm: packageManager === "npm",
		// pnpm: packageManager === "pnpm",
		// bun: packageManager === "bun",
		database,
		drizzle,
		prisma,
		install: !skipInstall,
		skipInstall,
		skipGit,
		frontend: frontend.length ? frontend : undefined,
		auth,
		// backend: backend === "none" ? undefined : backend,
		// runtime,
		// addons: addons.length ? addons : undefined,
		// examples: examples.length ? examples : undefined,
	};

	outro(chalk.green("✨ Your project will be set up with this configuration!"));
	return config;
};
