# Repository Guidelines

## Project Structure & Module Organization

This is a Vue 2 desktop app packaged with Electron via `vue-cli-plugin-electron-builder`.

- `src/main.js` initializes Vue, Element UI, Vuex, and Router.
- `src/background.js` and `src/preload.js` contain Electron main/preload behavior.
- `src/views/` holds route-level screens such as `convert`, `layout`, and `tableShow`.
- `src/components/` contains reusable UI and number-processing components.
- `src/router/`, `src/store/`, and `src/utils/` contain routing, shared state, and utility helpers.
- `public/` contains static web assets; `build/icons/` contains packaged app icons.
- `dist/` is the configured packaging output.

## Build, Test, and Development Commands

- `npm install`: install dependencies. Use Node 18 or newer.
- `npm run start`: launch the Electron app with Vue hot reload.
- `npm run win`: build a Windows installer using `electron-builder`.
- `npm run mac`: build a macOS DMG with the configured environment variables.
- `npm run icon`: regenerate Electron icon assets from `public/icon.png`.

There is no `npm test` or `npm run build` script in `package.json`; add scripts before relying on them.

## Coding Style & Naming Conventions

Use Vue single-file components for UI. Component files and directories are PascalCase for reusable components, for example `ResultOperator/index.vue` and `Convert/DiffUnion.vue`; route folders use lower camel case such as `tableShow`.

The project uses ESLint with `plugin:vue/essential` and `eslint:recommended`, but `lintOnSave` is disabled. Keep JavaScript modules ES-style, prefer the `@/` alias for `src`, and match nearby formatting. Entry JavaScript often uses 2-space indentation; many `.vue` files use 4 spaces.

## Testing Guidelines

No automated test framework is configured. For behavior changes, manually verify the affected flow with `npm run start`, including Electron APIs exposed through `window.electron`. If adding tests, colocate them near the changed module or introduce a clear `tests/` structure, and add a corresponding npm script.

## Commit & Pull Request Guidelines

Recent history follows Conventional Commit prefixes such as `feat:`, `fix:`, `fix(components):`, and `build:`. Keep subjects short and imperative, with a scope when useful.

Pull requests should include a concise description, affected screens/components, manual verification steps, and screenshots or recordings for UI changes. Link issues when available and note Windows or macOS packaging impact.

## Security & Configuration Tips

Avoid committing generated installers from `dist/` or local machine-specific paths. Keep Electron bridge changes in `src/preload.js` narrow and review any new IPC or clipboard behavior carefully.
