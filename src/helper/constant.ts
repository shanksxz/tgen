import path from "node:path";
import { fileURLToPath } from "node:url";

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
export const rootDir = path.join(__dirname, "../");
export const templatesDir = path.join(rootDir, "templates");
export const appsDir = path.join(rootDir, "apps");
export const packagesDir = path.join(rootDir, "packages");

export const packageDependenciesVersions = {
	"better-auth": "^1.0.21",
	"drizzle-orm": "^0.38.3",
};

export const packageDevDependenciesVersions = {
	"drizzle-kit": "^0.30.1",
	"dotenv-cli": "^8.0.0",
	"@types/pg": "^8.11.10",
	"@biomejs/biome": "^1.9.4",
};

export const AllDependencies = {
	...packageDependenciesVersions,
	...packageDevDependenciesVersions,
};

export type AllDependencies = keyof typeof AllDependencies;
export type AllDevDependenciesVersions =
	keyof typeof packageDevDependenciesVersions;
export type AllDependenciesVersions = keyof typeof packageDependenciesVersions;
