# Turbo Generator (tgen)

A CLI tool to scaffold and manage your Turborepo projects with best practices and modern tooling.

> **Note**: This project is currently in development. While the CLI infrastructure is complete, the actual templates are still being developed.

## Current Features

- 🚀 Project scaffolding infrastructure
- 📦 Package manager selection (pnpm, npm, bun)
- 🗄️ Database configuration (PostgreSQL, MySQL, SQLite)
- 🔌 ORM setup (Drizzle, Prisma)
- 🛠️ Git initialization
- 🔧 Husky configuration
- 📱 Apps and packages structure setup
- 🎯 TypeScript support

## Coming Soon

- Next.js app template
- React app template
- Express API template
- Documentation site template
- UI package template
- Config package template
- Database package templates
    - Drizzle setup for PostgreSQL/MySQL/SQLite
    - Prisma setup for PostgreSQL/MySQL/SQLite
- ESLint/Prettier configurations
- Testing setup templates
- CI/CD templates

## Installation

```bash
# clone the repository
git clone https://github.com/shanksxz/tgen.git

# install dependencies
pnpm install

# build the project
pnpm build

# link for local development
pnpm link -g
```

## Usage

Create a new project:

```bash
tgen [directory]
```

### Options

- `--husky` - Include husky setup (default: false)
- `--install` - Install dependencies (default: true)
- `--skip-install` - Skip installing dependencies
- `--skip-git` - Skip git initialization

### Examples

```bash
# create in current directory
tgen .

# Create in new directory
tgen my-turbo-app

# Create with specific options
tgen my-turbo-app --husky --skip-git
```

