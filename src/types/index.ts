export type TemplateType =
	| "app"
	| "package"
	| "default"
	| "base"
	| "config"
	| "start-database";

export type ProjectConfig = {
	name: string;
	template: TemplateType;
	database: "postgres" | "sqlite" | "mysql" | "none";
	husky: boolean;
	// npm: boolean;
	// pnpm: boolean;
	// bun: boolean;
	drizzle: boolean;
	prisma: boolean;
	install: boolean;
	skipInstall: boolean;
	skipGit: boolean;
	frontend?: string[];
	// backend?: string;
	// runtime?: string;
	auth?: "better-auth" | "next-auth" | "none";
	// addons?: string[];
	// examples?: string[];
};

export type Templates = {
	apps: {
		nextjs: string;
		react: string;
		t3: string;
	};
	base: Record<string, never>;
	configs: {
		"biome.json": string;
		server: {
			auth: {
				"better-auth": {
					"better-auth-drizzle-postgres": string;
					"better-auth-drizzle-sqlite": string;
					"better-auth-drizzle-mysql": string;
					"better-auth-prisma-postgres": string;
					"better-auth-prisma-sqlite": string;
					"better-auth-prisma-mysql": string;
				};
				"next-auth": {
					"next-auth-drizzle-postgres": string;
					"next-auth-drizzle-sqlite": string;
					"next-auth-drizzle-mysql": string;
					"next-auth-prisma-postgres": string;
					"next-auth-prisma-sqlite": string;
					"next-auth-prisma-mysql": string;
				};
			};
		};
	};
	default: Record<string, never>;
	packages: {
		database: {
			drizzle: {
				"drizzle-postgres": string;
				"drizzle-sqlite": string;
				"drizzle-mysql": string;
			};
			prisma: {
				"prisma-postgres": string;
				"prisma-sqlite": string;
				"prisma-mysql": string;
			};
		};
	};
	"start-database": string;
};
