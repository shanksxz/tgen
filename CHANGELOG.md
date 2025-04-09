# Changelog

All notable changes to this project will be documented in this file.

## [In-Progress]
### Templates (Coming Soon)
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
- TypeScript configurations
- Testing setup templates
- CI/CD templates

Note: Currently, the project only includes the CLI setup and infrastructure. Actual templates are under development.

### Added
- Initial project setup with TypeScript
- CLI tool with Commander.js
- Project scaffolding functionality
- Package manager selection (pnpm, npm, bun)
- Database integration options (PostgreSQL, MySQL, SQLite)
- ORM support (Drizzle, Prisma)
- Git repository initialization
- Husky setup for git hooks
- Apps and packages management
- Template processing system
- Interactive CLI prompts
- Project configuration options
- Error handling and logging
- Base template structure
- Apps template structure
- Database setup automation
- Improved dependency management system
  - Added new helper `add-deps.ts` for managing package dependencies
  - Centralized version management in `constant.ts`
  - Type-safe dependency management with TypeScript types
- Enhanced auth setup functionality
  - Added proper auth template copying to Next.js/T3 apps
  - Improved package.json updates for auth dependencies
  - Support for both better-auth and next-auth configurations
  - Automatic ORM adapter installation (Drizzle/Prisma)
- Modern CLI experience with Clack
  - Replaced inquirer with @clack/prompts for more intuitive prompting
  - Added visual spinners for long-running tasks
  - Better color formatting and visual hierarchy
  - Improved cancellation handling and user feedback
  - Progress indicators for setup steps

### Changed
- Converted project setup to class-based architecture
- Improved console output ordering
- Enhanced error messages with colors
- Restructured project folders for better organization
- Refactored auth setup process
  - Moved auth files to `src/server/auth` in Next.js apps
  - Improved dependency management for auth packages
  - Better error handling during setup
- Updated dependency management
  - Moved from hardcoded versions to centralized version management
  - Added type safety for package versions
  - Improved package.json update logic
- Improved CLI experience
  - Modernized UI with Clack
  - Smarter directory and project name handling
  - Better error display and recovery options

### Fixed
- Console output ordering in setup process
- Template processing for conditional blocks
- Directory handling for existing projects
- Fixed auth template copying issues
- Fixed package.json update logic to preserve existing dependencies
- Fixed directory structure issues in Next.js apps
- Improved error handling in dependency management
- Fixed project name handling when directory is specified
- Fixed CLI behavior when run without arguments

