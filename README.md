# Camino Suite 2.0

A modern monorepo workspace built with [Nx](https://nx.dev) for scalable enterprise applications.

## Installation

```bash
# Install dependencies
yarn install

# Or using npm
npm install
```

## Available Scripts

### Development
```bash
# Start all applications in development mode
yarn dev:all

# Start specific application
nx dev camino-suite  # Runs only the camino-suite app
# or
nx dev your-app-name # Replace with specific app name
```

> **Note:** `npx nx dev camino-suite` will only run the specified application, while `yarn dev:all` runs all applications in parallel. Use `dev:all` when you need to work with multiple applications simultaneously.

### Production
```bash
# Build all projects
yarn build:all

# Start production server
yarn start:production
```

### Storybook
```bash
# Start Storybook development server
yarn storybook

# Build Storybook
yarn build:storybook

# Serve built Storybook
yarn start:storybook
```

### Testing
```bash
# Run all tests
yarn test:all

# Run all e2e tests
yarn e2e:all

# Run linting with auto-fix
yarn lint:all
```

## Project Structure

The workspace is organized as a monorepo with the following structure:

```
├── apps/
│   └── camino-suite/    # Main application
├── libs/
│   ├── apps/            # Feature sub-applications
│   ├── data/            # Data models and types
│   ├── logic/           # Business logic and services
│   ├── store/           # State management (shared global store)
│   ├── styles/          # Shared styles and themes
│   └── ui/              # Reusable UI components
```

## Running Specific Projects

To run a specific project or multiple projects:

```bash
# Run a single project
nx dev project-name

# Run multiple specific projects
nx run-many --target=dev --projects=app1,app2 --parallel=true
```

## Adding New Components

### Creating a Sub-Application
To add a new sub-application that shares the global store:

```bash
nx g @nrwl/next:lib my-feature --directory=libs/apps
```

### Creating Other Library Types

```bash
# Create a new library
nx g @nx/next:lib my-library
```

## Adding New Packages

To add a new package to the workspace:

```bash
# Add a package to the root workspace
yarn add package-name

# Add a dev dependency
yarn add -D package-name

# Add a package to a specific project
yarn add package-name --scope=project-name
```

Example of adding common dependencies:
```bash
# Add UI dependencies
yarn add @mui/material @emotion/react @emotion/styled
yarn add -D @storybook/react @storybook/addon-essentials

# Add testing dependencies
yarn add -D @testing-library/react @testing-library/jest-dom

# Add development tools
yarn add -D eslint prettier typescript
```

> **Note:** When adding packages, make sure to check the workspace's package.json for existing dependencies to avoid version conflicts.

## Development Tools

### Nx Console

For a better development experience, install [Nx Console](https://nx.dev/getting-started/editor-setup) - a powerful IDE extension that provides:
- Visual task running
- Code generation UI
- Enhanced code completion
- Project graph visualization

Available for VSCode and IntelliJ.

## Project Graph

Visualize the project's dependency graph:

```bash
npx nx graph
```

## Learn More

- [Nx Documentation](https://nx.dev/nx-api/next)
- [Setting up CI with Nx](https://nx.dev/ci/intro/ci-with-nx)
- [Managing Releases](https://nx.dev/features/manage-releases)

## Community

- [Discord](https://go.nx.dev/community)
- [Twitter](https://twitter.com/nxdevtools)
- [LinkedIn](https://www.linkedin.com/company/nrwl)
- [YouTube](https://www.youtube.com/@nxdevtools)
- [Blog](https://nx.dev/blog)