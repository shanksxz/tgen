import path from "node:path";
import { fileURLToPath } from "node:url";

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
export const rootDir = path.join(__dirname, "../");
export const templatesDir = path.join(rootDir, "templates");
export const appsDir = path.join(rootDir, "apps");
export const packagesDir = path.join(rootDir, "packages");
