# Markdown Editor Constitution

<!-- Sync Impact Report
Version change: (initial) → 1.0.0
Modified principles: New constitution
Added sections: All sections (new constitution)
Removed sections: None
Templates requiring updates: 
✅ Updated: Core principles aligned with TDD and component architecture
⚠ Pending: Manual review of task categorization in templates
Follow-up TODOs: None
-->

## Core Principles

### I. Test-Driven Development (NON-NEGOTIABLE)
TDD MUST be followed for all development: Write tests first → Get user approval → Watch tests fail → Implement to pass. Red-Green-Refactor cycle is strictly enforced. All features require tests before implementation begins.

**Rationale**: Ensures quality, prevents regressions, and validates requirements before code is written.

### II. Component Architecture
Components MUST follow Presentational/Container pattern. Shared components in `src/components/`, feature-specific components in `src/features/`. Each component requires Storybook stories for UI development and testing.

**Rationale**: Clear separation of concerns, improved reusability, and systematic UI development.

### III. Feature-Based Organization
Code MUST be organized by feature in `src/features/` with clear boundaries. Each feature includes its own hooks, types, services, and utils. Cross-feature dependencies require explicit justification.

**Rationale**: Enables scalability, modularity, and team ownership of specific features.

### IV. Type Safety
TypeScript MUST be used throughout. All public APIs require explicit type definitions. The `tc` command MUST pass before any commit.

**Rationale**: Prevents runtime errors, improves code documentation, and enables better refactoring.

### V. Code Quality Standards
Biome MUST format and lint all code. The `bc` command MUST pass before any commit. Configuration follows project standards: 2-space indentation, single quotes.

**Rationale**: Consistent code style improves readability and reduces review friction.

### VI. Japanese Language Requirement
All user-facing text, documentation, and comments MUST be written in Japanese. Exceptions require explicit approval from the team lead.

**Rationale**: Ensures clarity for a Japanese-speaking development team and end-users, and maintains consistency across the project.

## Technology Constraints

### Required Stack
- Next.js 15 with App Router for routing and SSR
- React 19 for UI components
- pnpm for package management
- Biome for formatting and linting (replaces ESLint)
- Vitest with jsdom for testing
- Storybook for component development
- TypeScript <5.5.0 for type checking

### Import Patterns
Use `@/*` alias for `src/` directory imports. Follow absolute import paths from `src/`. Biome automatically organizes imports according to project configuration.

## Development Workflow

### Testing Requirements
All features MUST have unit tests using Vitest. Component tests MUST use React Testing Library with jsdom environment. Coverage reports generated via `pnpm test:coverage`.

### Development Commands
- `pnpm dev` for development with Turbopack
- `pnpm test` for test execution
- `pnpm tc` for TypeScript checking
- `pnpm bc` for code quality checks
- `pnpm storybook` for component development

### Quality Gates
Before any commit: TypeScript check passes, Biome formatting/linting passes, all tests pass. No exceptions to quality gates.

## Governance

This constitution supersedes all other development practices. All code reviews MUST verify compliance with these principles. Complexity MUST be justified with clear business requirements.

Amendments require documentation, team approval, and migration plan for existing code. Use CLAUDE.md for runtime development guidance and command references.

**Version**: 1.0.0 | **Ratified**: 2025-01-20 | **Last Amended**: 2025-01-20