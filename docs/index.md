<style>
  html, body { background-color: #0d1117; color: #c9d1d9; }
  .page-header {
    background-color: #161b22;
    background-image: linear-gradient(120deg, #155799, #159957);
    border-bottom: 1px solid #30363d;
  }
  .page-header h1, .page-header h2, .page-header .project-tagline { color: #ffffff; }
  .main-content h1, .main-content h2, .main-content h3,
  .main-content h4, .main-content h5, .main-content h6 { color: #e6edf3; }
  a { color: #58a6ff; }
  a:hover { color: #79c0ff; }
  code { background-color: rgba(255,255,255,0.08); color: #e6edf3; }
  pre { background-color: #161b22; border: 1px solid #30363d; }
  hr { border-color: rgba(255,255,255,0.1); }
  blockquote { color: #8b949e; border-left-color: #30363d; background-color: rgba(255,255,255,0.03); }
  table {
    display: block; overflow-x: auto; max-width: 100%; -webkit-overflow-scrolling: touch;
    border-collapse: collapse; background-color: #161b22; border: 1px solid #30363d; border-radius: 6px;
  }
  table th, table td { padding: 0.6rem 0.8rem; border: 1px solid #30363d; white-space: nowrap; }
  table th { font-weight: 600; background-color: #21262d; color: #e6edf3; }
  table tr:nth-child(even) { background-color: rgba(255,255,255,0.02); }
  table tr:hover { background-color: rgba(255,255,255,0.04); }
  @media screen and (max-width: 480px) {
    table th, table td { white-space: normal; font-size: 0.85rem; padding: 0.4rem 0.5rem; }
  }
</style>

# react-native-comscore-sdk

[![npm version](https://badge.fury.io/js/react-native-comscore-sdk.svg)](https://badge.fury.io/js/react-native-comscore-sdk)
[![docs](https://img.shields.io/badge/docs-GitHub%20Pages-blue)](https://wellbrito29.github.io/react-native-comscore-sdk/)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

A React Native **Turbo Module** that wraps the native [Comscore](https://www.comscore.com/) SDK for audience measurement on **iOS** and **Android**.

- ✅ **New Architecture** — Built for TurboModules + Fabric (React Native 0.83+)
- ✅ **TypeScript** — Fully typed API with strict mode
- ✅ **Consent & Privacy** — Built-in support for GDPR consent (`cs_ucfr`) and child-directed mode (COPPA)
- ✅ **Validation Mode** — Debug-only implementation validation for Comscore certification

---

## Requirements

| Platform | Minimum Version | Notes |
|---|---|---|
| React Native | `0.83.0` | New Architecture (TurboModules) required |
| iOS | `15.1` | |
| Android | `minSdk 24` | |
| Comscore SDK (iOS) | `~> 6.0` | Installed via CocoaPods |
| Comscore SDK (Android) | `6.11.0` | Installed via Maven Central |

---

## Installation

```sh
npm install react-native-comscore-sdk
# or
yarn add react-native-comscore-sdk
```

### iOS Setup

```sh
cd ios && pod install
```

The library depends on the `ComScore` CocoaPod (`~> 6.0`), which will be installed automatically.

### Android Setup

The library automatically pulls the Comscore Android SDK from Maven Central via Gradle. No additional setup is required.

> **Note for Validation Mode:** If you plan to inspect Comscore network traffic with Charles Proxy on Android 7.0+, the library includes a default `network_security_config.xml` that whitelists `scorecardresearch.com` for debug builds. See [VALIDATION.md](./VALIDATION.md) for details.

---

## Usage

### Initialization

Initialize the SDK as early as possible (e.g., in your root component or app entry point). The module guards against double-initialization.

```tsx
import Comscore from 'react-native-comscore-sdk';

useEffect(() => {
  Comscore.initialize({
    publisherId: 'YOUR_PUBLISHER_ID',
    applicationName: 'My App Name',
    initialConsent: '1', // "1" opted-in, "0" opted-out, "" unknown
    usagePropertiesAutoUpdateMode: 'foregroundOnly',
    autoUpdateIntervalSeconds: 60,
    childDirected: false,
    validationMode: __DEV__, // NEVER enable in production
  });
}, []);
```

#### `ComscoreConfig`

| Property | Type | Required | Default | Description |
|---|---|---|---|---|
| `publisherId` | `string` | ✅ | — | Your Comscore publisher ID |
| `applicationName` | `string` | | `''` | Application name reported to Comscore |
| `usagePropertiesAutoUpdateMode` | `'foregroundOnly' \| 'foregroundAndBackground' \| 'disabled'` | | `''` | When usage properties are auto-updated |
| `autoUpdateIntervalSeconds` | `number` | | `-1` | Interval in seconds (minimum: 60) |
| `childDirected` | `boolean` | | `false` | Enables COPPA/child-directed mode. Disables advertising identifiers |
| `validationMode` | `boolean` | | `false` | **Debug only.** Enables Comscore implementation validation |
| `startOnlyWhenUIIsVisible` | `boolean` | | `false` | Delays analytics start until UI is visible |
| `initialConsent` | `'0' \| '1' \| ''` | | `''` | Initial GDPR consent state |
| `debugLogs` | `boolean` | | `false` | Enables SDK debug logging |

---

### Tracking Sections

Notify Comscore when the user navigates to a new screen or section.

```tsx
// Track a named section
Comscore.trackSection('Home');

// Track with no specific section (e.g., splash screen)
Comscore.trackSection('');
```

---

### Updating Consent

If the user changes their consent preference after initialization, update it dynamically. The module automatically fires a hidden event so Comscore picks up the change immediately.

```tsx
// User opted in
Comscore.updateConsent('1');

// User opted out
Comscore.updateConsent('0');

// Unknown / no action
Comscore.updateConsent('');
```

> **Accepted values:** `"1"` (opted in), `"0"` (opted out), `""` (unknown).

---

### Background User Experience

If your app provides a background experience (e.g., audio playback), notify Comscore when the UX becomes active or inactive.

```tsx
// When background playback starts
Comscore.notifyUxActive();

// When background playback stops
Comscore.notifyUxInactive();
```

---

### Child-Directed Mode (COPPA)

You can toggle child-directed mode after initialization. When enabled, the SDK stops collecting advertising identifiers.

```tsx
Comscore.setChildDirected(true);
```

---

### Validation Mode

Enable validation mode to output debug request URLs. This is **blocked in release builds** on both platforms.

```tsx
Comscore.setValidationMode(true);
```

---

### SDK Version

```tsx
const version = await Comscore.getVersion();
console.log(version); // e.g., "6.15.0+2509100829"
```

---

## API Reference

```ts
interface ComscoreModule {
  initialize(config: ComscoreConfig): Promise<void>;
  notifyUxActive(): Promise<void>;
  notifyUxInactive(): Promise<void>;
  trackSection(sectionName?: string | null): Promise<void>;
  updateConsent(value: '0' | '1' | ''): Promise<void>;
  setChildDirected(enabled: boolean): Promise<void>;
  setValidationMode(enabled: boolean): Promise<void>;
  getVersion(): Promise<string>;
}
```

---

## Validation

For detailed instructions on validating your Comscore implementation using Charles Proxy and the SDK's Validation Mode, see [**VALIDATION.md**](./VALIDATION.md).

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup, build commands, and commit conventions.

---

## License

MIT © [Wellington Nascimento](https://github.com/Wellbrito29)
