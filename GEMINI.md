# GEMINI.md - Project Context & Instructions

## Project Overview
`rn-comscore` is a React Native Turbo Module that wraps the Comscore SDK for audience measurement. It provides a bridge between React Native applications and the native Comscore libraries for Android and iOS.

### Main Technologies
- **React Native**: 0.83.0 (utilizing Turbo Modules / New Architecture).
- **TypeScript**: Core logic and module specifications.
- **Kotlin**: Native Android implementation.
- **Objective-C++**: Native iOS implementation.
- **react-native-builder-bob**: Used for library orchestration and building.

### Architecture
The project follows the Turbo Module pattern:
- **Specification**: Defined in `src/NativeComscore.ts` using TypeScript.
- **Codegen**: Generates native base classes (`NativeComscoreSpec` on Android, `NativeComscoreSpecJSI` on iOS).
- **Implementation**: Native modules extend the generated specs to provide functionality.

---

## Building and Running

### Root Project Commands
- `yarn`: Install dependencies.
- `yarn prepare`: Builds the library using `react-native-builder-bob`. This generates the `lib/` directory.
- `yarn lint`: Runs ESLint for code quality.
- `yarn typecheck`: Runs TypeScript compiler to check for type errors.
- `yarn test`: Runs Jest tests for the JavaScript layer.
- `yarn clean`: Removes build artifacts (`android/build`, `ios/build`, `lib/`, etc.).

### Example App Commands
The `example/` directory contains a sample app to test the module.
- `yarn example android`: Runs the example app on an Android emulator/device.
- `yarn example ios`: Runs the example app on an iOS simulator/device.
- `yarn example start`: Starts the Metro bundler for the example app.

---

## Key Files & Directories
- `src/NativeComscore.ts`: The Turbo Module specification file. Define new native methods here first.
- `src/index.tsx`: The public JavaScript API exported by the library.
- `android/src/main/java/com/comscore/ComscoreModule.kt`: Kotlin implementation for Android.
- `ios/Comscore.mm`: Objective-C++ implementation for iOS.
- `helpers/`: Contains Comscore SDK implementation guides and validation processes (extracted from PDFs).
    - `comscore-android-guide.md`: Detailed Android implementation steps.
    - `comscore-apple-guide.md`: Detailed iOS/iPadOS/tvOS implementation steps.
    - `comscore-validation-guide.md`: Steps for validating the Comscore tag responses.

---

## Development Conventions

### Native Implementation
- **Android**: All native methods must be overridden in `ComscoreModule.kt`. Use `Double` for numeric parameters passed from JS `number`.
- **iOS**: Implementation resides in `Comscore.mm`. Uses `NSNumber` and `double` for bridging.

### Codegen
When changing the API in `src/NativeComscore.ts`, you may need to run `yarn prepare` to trigger codegen and ensure native base classes are updated.

### Testing
- JavaScript tests should be added to `src/__tests__/`.
- Native functionality should be verified using the `example/` app.

### Validation
Follow the guides in `helpers/` to ensure the Comscore SDK is correctly initialized and sending data. Specifically, look into "Validation Mode" for testing:
`Analytics.getConfiguration().enableImplementationValidationMode()` (to be implemented).
