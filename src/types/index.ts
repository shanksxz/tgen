export type TemplateType = "app" | "package" | "default" | "base" | "config" | "start-database";

export type ProjectConfig = {
    name: string;
    template: TemplateType;
    database: "postgres" | "sqlite" | "mysql";
    husky: boolean;
    npm: boolean;
    pnpm: boolean;
    bun: boolean;
    drizzle: boolean;
    prisma: boolean;
    install: boolean;
    skipInstall: boolean;
    skipGit: boolean;
    turbo: boolean;
}; 