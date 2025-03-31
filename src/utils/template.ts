import fs from "fs/promises";
import path from "path";
import { type ProjectConfig } from "../types";

export const copyTemplate = async (
    templatePath: string,
    targetPath: string,
    config: ProjectConfig
): Promise<void> => {
    try {
        // Create target directory if it doesn't exist
        await fs.mkdir(targetPath, { recursive: true });

        // Read template directory
        const entries = await fs.readdir(templatePath, { withFileTypes: true });

        for (const entry of entries) {
            const srcPath = path.join(templatePath, entry.name);
            const destPath = path.join(targetPath, entry.name);

            if (entry.isDirectory()) {
                // Recursively copy directories
                await copyTemplate(srcPath, destPath, config);
            } else {
                // Process and copy files
                if (entry.name.endsWith('.template')) {
                    // Process template files
                    const content = await fs.readFile(srcPath, 'utf-8');
                    const processed = processTemplateContent(content, config);
                    await fs.writeFile(
                        destPath.replace('.template', ''),
                        processed
                    );
                } else {
                    // Direct copy for non-template files
                    await fs.copyFile(srcPath, destPath);
                }
            }
        }
    } catch (error) {
        throw new Error(`Failed to copy template: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};

const processTemplateContent = (content: string, config: ProjectConfig): string => {
    // Replace template variables
    return content
        .replace(/\{\{name\}\}/g, config.name)
        .replace(/\{\{#if husky\}\}([\s\S]*?)\{\{\/if\}\}/g, (_, block) =>
            config.husky ? block : ''
        )
        .replace(/\{\{#if drizzle\}\}([\s\S]*?)\{\{\/if\}\}/g, (_, block) =>
            config.drizzle ? block : ''
        )
        .replace(/\{\{#if prisma\}\}([\s\S]*?)\{\{\/if\}\}/g, (_, block) =>
            config.prisma ? block : ''
        );
};

export const setupDatabase = async (config: ProjectConfig, projectPath: string): Promise<void> => {
    if (config.drizzle || config.prisma) {
        const dbScriptPath = path.join(__dirname, '../../templates/start-database');
        // Copy database setup scripts
        await copyTemplate(dbScriptPath, path.join(projectPath, 'scripts'), config);
    }
};

export const installDependencies = async (projectPath: string, config: ProjectConfig): Promise<void> => {
    if (config.skipInstall) return;

    const { execSync } = require('child_process');
    const cwd = { cwd: projectPath };

    try {
        if (config.pnpm) {
            execSync('pnpm install', cwd);
        } else if (config.npm) {
            execSync('npm install', cwd);
        } else if (config.bun) {
            execSync('bun install', cwd);
        }
    } catch (error) {
        throw new Error('Failed to install dependencies');
    }
};

export const initGit = async (projectPath: string): Promise<void> => {
    const { execSync } = require('child_process');
    try {
        execSync('git init', { cwd: projectPath });
        execSync('git add .', { cwd: projectPath });
        execSync('git commit -m "Initial commit"', { cwd: projectPath });
    } catch (error) {
        throw new Error('Failed to initialize git repository');
    }
}; 