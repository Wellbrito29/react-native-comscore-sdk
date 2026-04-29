# AGENTS.md — react-native-comscore

This file contains project-specific context for AI coding agents. If you are working on this codebase, read this first.

---

## Project Overview

`react-native-comscore` is a React Native **Turbo Module** that wraps the native Comscore SDK for audience measurement on Android and iOS. It exposes a TypeScript API to React Native apps, bridging to Kotlin (Android) and Objective-C++/Swift (iOS) implementations that invoke the official Comscore libraries.

- **Library type**: Turbo Module (New Architecture)
- **Package manager**: Yarn 4.11.0 (workspaces enabled)
- **Monorepo layout**: Root = library package; `example/` = sample React Native app consuming the library
- **Repository**: https://github.com/Wellbrito29/react-native-comscore
- **License**: MIT

### Technology Stack

| Layer | Technology | Version / Notes |
|---|---|---|
| React Native | 0.83.0 | New Architecture (Fabric + TurboModules) |
| TypeScript | 5.9.2 | Strict mode enabled |
| Android | Kotlin | 2.0.21; Gradle 8.7.2 |
| iOS | Objective-C++ / Swift | Bridges via `Comscore.mm` → `ComscoreImpl.swift` |
| Comscore SDK (Android) | `com.comscore:android-analytics` | 6.11.0 |
| Comscore SDK (iOS) | CocoaPods `Comscore` | `~> 6.0` |
| Build tool | react-native-builder-bob | Outputs `lib/` (ESM + TypeScript declarations) |
| Testing | Jest | Preset: `react-native` |
| Linting | ESLint 9 (flat config) + Prettier | Config: `eslint.config.mjs` |
| Git hooks | lefthook | Pre-commit lint + typecheck; commit-msg conventional commits |
| Release | release-it + conventional-changelog | Angular preset |
| CI | GitHub Actions | Ubuntu + macOS runners; turbo caching for native builds |

---

## Directory Structure

```
.
├── src/                          # TypeScript source for the library
│   ├── index.tsx                 # Public JS API (ComscoreModule)
│   ├── NativeComscore.ts         # TurboModule spec (codegen input)
│   └── __tests__/
│       └── index.test.tsx        # Jest unit tests (currently minimal)
├── android/                      # Android library module
│   ├── build.gradle              # Gradle config, dependencies, SDK versions
│   └── src/main/java/com/comscore/
│       ├── ComscoreModule.kt     # Native implementation (extends NativeComscoreSpec)
│       └── ComscorePackage.kt    # TurboModule package registration
│   └── src/main/res/xml/
│       └── network_security_config.xml  # Debug-only Charles Proxy whitelist
├── ios/                          # iOS library module
│   ├── Comscore.h                # Objective-C header
│   ├── Comscore.mm               # Objective-C++ TurboModule bridge
│   └── ComscoreImpl.swift        # Swift implementation calling ComScore SDK
├── example/                      # Example React Native app (Yarn workspace)
│   ├── src/App.tsx               # Demo UI exercising the library
│   ├── android/                  # Example Android project
│   └── ios/                      # Example iOS project
├── helpers/                      # Extracted Comscore official guides
│   ├── comscore-android-guide.md
│   ├── comscore-apple-guide.md
│   └── comscore-validation-guide.md
├── .github/
│   ├── actions/setup/action.yml  # Reusable composite action (Node + Yarn install)
│   └── workflows/ci.yml          # CI pipeline
├── package.json                  # Root library manifest & scripts
├── Comscore.podspec              # iOS CocoaPods specification
├── tsconfig.json                 # TypeScript config (strict)
├── tsconfig.build.json           # TS config for library build (excludes example, lib)
├── eslint.config.mjs             # ESLint flat config
├── babel.config.js               # Babel preset overrides for bob
├── lefthook.yml                  # Git hooks definition
├── turbo.json                    # Turborepo task definitions for native builds
└── .nvmrc                        # Node version: v22.20.0
```

---

## Build and Test Commands

All commands should be run from the repository root unless noted otherwise.

### Library Development

| Command | Description |
|---|---|
| `yarn` | Install dependencies for the workspace (root + example). |
| `yarn prepare` | Build the library with `react-native-builder-bob` (outputs `lib/`). Run after modifying `src/`. |
| `yarn typecheck` | Run `tsc` with `tsconfig.json` (no emit). |
| `yarn lint` | Run ESLint on `**/*.{js,ts,tsx}`. |
| `yarn lint --fix` | Auto-fix lint and formatting issues. |
| `yarn test` | Run Jest unit tests. |
| `yarn clean` | Delete build artifacts (`android/build`, `example/*/build`, `lib/`). |
| `yarn release` | Bump version, generate changelog, publish to npm, create GitHub release. |

### Example App

The example app is a Yarn workspace member named `react-native-comscore-example`.

| Command | Description |
|---|---|
| `yarn example start` | Start Metro bundler for the example app. |
| `yarn example android` | Run the example app on Android (`react-native run-android`). |
| `yarn example ios` | Run the example app on iOS (`react-native run-ios`). |

### Native Builds (via Turbo)

`turborepo` orchestrates native example builds in CI:

| Command | Description |
|---|---|
| `yarn turbo run build:android` | Build the example Android app via Gradle. |
| `yarn turbo run build:ios` | Build the example iOS app via Xcode. |

**Note**: Native code changes require rebuilding the example app. TypeScript changes in `src/` are reflected automatically via Metro.

---

## Code Style Guidelines

- **Language**: All comments, docs, and commit messages are in English.
- **Formatter**: Prettier (config embedded in `package.json`):
  - `singleQuote: true`
  - `trailingComma: "es5"`
  - `tabWidth: 2`
  - `useTabs: false`
- **Linter**: ESLint 9 flat config extending `@react-native` and `prettier`.
  - `react/react-in-jsx-scope` is off.
  - `prettier/prettier` is an error.
- **TypeScript**: Strict mode is enforced (`strict: true`, `noUncheckedIndexedAccess: true`, `noUnusedLocals: true`, `noUnusedParameters: true`, `verbatimModuleSyntax: true`).
- **Imports**: Use `verbatimModuleSyntax` — use `import type` for type-only imports.
- **Native Code Style**:
  - **Android (Kotlin)**: Follow standard Kotlin conventions. Use `Double` for JS `number` parameters.
  - **iOS (Obj-C++ / Swift)**: Obj-C++ bridge forwards to Swift impl. Swift uses `ComScore` SDK APIs (`SCORAnalytics`, `SCORPublisherConfiguration`).

---

## Testing Instructions

### JavaScript / TypeScript Tests

- **Framework**: Jest with `react-native` preset.
- **Config**: Defined in `package.json` under `jest`:
  - Ignores `<rootDir>/example/node_modules` and `<rootDir>/lib/`.
- **Running**: `yarn test`
- **Current state**: `src/__tests__/index.test.tsx` contains only a placeholder (`it.todo('write a test')`). New features and bug fixes should include real unit tests.

### Native Testing

- There are no automated native unit tests in this project.
- Verify native behavior by running the **example app** (`yarn example android` / `yarn example ios`).
- For network validation, use **Charles Proxy** and enable **Validation Mode** (see Security & Validation below).

### CI Pipeline

The `.github/workflows/ci.yml` runs on `push`/`pull_request` to `main` and on `merge_group`:

1. **lint** — `yarn lint` + `yarn typecheck`
2. **test** — `yarn test --maxWorkers=2 --coverage`
3. **build-library** — `yarn prepare`
4. **build-android** — `yarn turbo run build:android` (with Gradle + turborepo caching)
5. **build-ios** — `yarn turbo run build:ios` (on macOS with Xcode 26, CocoaPods, turborepo caching)

---

## Security Considerations

### Validation Mode

The Comscore SDK supports an **Implementation Validation Mode** that outputs debug request URLs. This must **never** be enabled in production.

- **iOS**: Validation mode calls are wrapped in `#if DEBUG` compile-time checks.
- **Android**: Validation mode is only enabled when `ApplicationInfo.FLAG_DEBUGGABLE` is set (debug builds).
- **JS API**: `validationMode` is accepted in `Comscore.initialize(config)`, but the native layer blocks it in release builds.

### Network Security (Debug Only)

- `android/src/main/res/xml/network_security_config.xml` whitelists `scorecardresearch.com` for Charles Proxy SSL inspection.
- This config is intended for **debug/validation builds only**.

### User Consent

- The library communicates consent via the persistent label `cs_ucfr`.
- Accepted values: `"1"` (opted in), `"0"` (opted out), `""` (unknown / no action).
- When consent is updated after initialization, the native code updates the persistent label **and** fires a hidden event (`notifyHiddenEvent`) so Comscore picks up the change.

### Child-Directed Mode

- `childDirected: true` disables advertising identifier collection on both platforms.
- On Android this also satisfies Google Play Store Data safety form requirements (see `helpers/comscore-android-guide.md`).

---

## Module Architecture

### Turbo Module Flow

1. **Spec** (`src/NativeComscore.ts`): Defines the `TurboModule` interface with typed methods.
2. **Codegen** (`codegenConfig` in `package.json`): Generates native base classes (`NativeComscoreSpec` on Android, `NativeComscoreSpecJSI` on iOS).
3. **Implementation**:
   - Android: `ComscoreModule.kt` extends `NativeComscoreSpec`.
   - iOS: `Comscore.mm` implements `NativeComscoreSpec` and delegates to `ComscoreImpl.swift`.
4. **Public API** (`src/index.tsx`): Wraps the Turbo Module with validation, initialization guards, and ergonomic config types.

### Key API Surface

```ts
Comscore.initialize(config: ComscoreConfig): Promise<void>
Comscore.trackSection(sectionName?: string | null): Promise<void>
Comscore.notifyUxActive(): Promise<void>
Comscore.notifyUxInactive(): Promise<void>
Comscore.updateConsent(value: '0' | '1' | ''): Promise<void>
Comscore.setChildDirected(enabled: boolean): Promise<void>
Comscore.setValidationMode(enabled: boolean): Promise<void>
Comscore.getVersion(): Promise<string>
```

The JS layer guards against double-initialization and validates that `publisherId` is a non-empty string before calling native code.

---

## Release & Publishing

- **Tool**: `release-it` with `@release-it/conventional-changelog` (Angular preset).
- **Trigger**: `yarn release` (bumps version, commits `chore: release ${version}`, tags `v${version}`, publishes to npm, creates GitHub release).
- **Commit convention**: Conventional commits enforced by `lefthook` + `commitlint`.
  - Allowed types: `fix`, `feat`, `refactor`, `docs`, `test`, `chore`.

---

## Useful References

- `README.md` — Installation and basic usage.
- `CONTRIBUTING.md` — Detailed development workflow and PR guidelines.
- `VALIDATION.md` — Charles Proxy setup and validation mode usage.
- `helpers/comscore-android-guide.md` — Official Android SDK implementation guide.
- `helpers/comscore-apple-guide.md` — Official iOS/tvOS SDK implementation guide.
- `helpers/comscore-validation-guide.md` — Validation contacts and UDIDs.
