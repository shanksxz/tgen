import inquirer from "inquirer";

export const askProjectPreferences = async (options: {
	skipGit?: boolean;
	skipInstall?: boolean;
	install?: boolean;
	husky?: boolean;
}) => {
	const gitPrefs = await inquirer.prompt([
		{
			type: "confirm",
			name: "initGit",
			message: "🔧 Would you like to initialize a git repository?",
			default: !options.skipGit,
			when: !options.skipGit,
		},
	]);

	const packagePrefs = await inquirer.prompt([
		{
			type: "list",
			name: "packageManager",
			message: "📦 Which package manager would you like to use?",
			choices: [
				{ name: "pnpm (Recommended)", value: "pnpm" },
				{ name: "npm", value: "npm" },
				{ name: "bun", value: "bun" },
			],
			default: "pnpm",
		},
	]);

	const installPrefs = await inquirer.prompt([
		{
			type: "confirm",
			name: "installDeps",
			message: "📥 Would you like to install dependencies after setup?",
			default: options.install !== false,
			when: !options.skipInstall,
		},
	]);

	const huskyPrefs = await inquirer.prompt([
		{
			type: "confirm",
			name: "useHusky",
			message: "🐶 Would you like to setup Husky for git hooks?",
			default: options.husky ?? false,
			when: gitPrefs.initGit,
		},
	]);

	return {
		shouldInitGit: options.skipGit ? false : (gitPrefs.initGit ?? false),
		shouldInstallDeps: options.skipInstall
			? false
			: (installPrefs.installDeps ?? options.install !== false),
		packageManager: packagePrefs.packageManager,
		useHusky: gitPrefs.initGit ? (huskyPrefs.useHusky ?? false) : false,
	};
};

export const askDatabasePreferences = async (): Promise<{
	database: "postgres" | "sqlite" | "mysql";
	drizzle: boolean;
	prisma: boolean;
}> => {
	const { useDatabase } = await inquirer.prompt([
		{
			type: "confirm",
			name: "useDatabase",
			message: "🗄️  Would you like to set up a database?",
			default: true,
		},
	]);

	if (!useDatabase) {
		return {
			database: "postgres",
			drizzle: false,
			prisma: false,
		};
	}

	const { database } = await inquirer.prompt([
		{
			type: "list",
			name: "database",
			message: "💾 Which database would you like to use?",
			choices: [
				{ name: "PostgreSQL (Recommended)", value: "postgres" },
				{ name: "MySQL", value: "mysql" },
				{ name: "SQLite", value: "sqlite" },
			],
			default: "postgres",
		},
	]);

	const { orm } = await inquirer.prompt([
		{
			type: "list",
			name: "orm",
			message: "🔌 Which ORM would you like to use?",
			choices: [
				{ name: "Drizzle (Recommended)", value: "drizzle" },
				{ name: "Prisma", value: "prisma" },
			],
			default: "drizzle",
		},
	]);

	return {
		database,
		drizzle: orm === "drizzle",
		prisma: orm === "prisma",
	};
};
