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

export const getTemplatePath = (
	config: {
		frontend?: string[];
		// backend?: string;
		database?: "postgres" | "sqlite" | "mysql" | "none";
		orm?: "drizzle" | "prisma";
		auth?: "better-auth" | "next-auth" | "none";
	},
	templateType: "app" | "config" | "database" | "auth" | "server",
): string => {
	switch (templateType) {
		case "app":
			if (config.frontend?.includes("nextjs")) return "apps/nextjs";
			if (config.frontend?.includes("react")) return "apps/react";
			if (config.frontend?.includes("t3")) return "apps/t3";
			return "";
		case "database":
			if (config.database === "none") return "";
			if (config.orm === "drizzle") {
				return `packages/database/drizzle/drizzle-${config.database}`;
			}
			if (config.orm === "prisma") {
				return `packages/database/prisma/prisma-${config.database}`;
			}
			return "";
		case "auth":
			if (config.auth === "none" || config.database === "none") return "";
			if (config.auth === "better-auth") {
				if (config.orm === "drizzle") {
					return `configs/server/auth/better-auth/better-auth-drizzle-${config.database}`;
				}
				if (config.orm === "prisma") {
					return `configs/server/auth/better-auth/better-auth-prisma-${config.database}`;
				}
			}
			if (config.auth === "next-auth") {
				if (config.orm === "drizzle") {
					return `configs/server/auth/next-auth/next-auth-drizzle-${config.database}`;
				}
				if (config.orm === "prisma") {
					return `configs/server/auth/next-auth/next-auth-prisma-${config.database}`;
				}
			}
			return "";
		case "server":
			//TODO: implement this later
			// if (config.backend === "none") return "";
			// return `configs/server/${config.backend}`;
			return "";
		case "config":
			return "configs/biome.json";
		default:
			return "";
	}
};
