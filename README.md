# react-native-comscore

React Native Turbo Module wrapper for the Comscore SDK.

## Installation

```sh
npm install react-native-comscore
# or
yarn add react-native-comscore
```

### iOS Setup
The library depends on the `Comscore` pod. Run:
```sh
cd ios && pod install
```

### Android Setup
The library automatically handles the Comscore dependency via Maven Central. However, for **Validation Mode** to work with Charles Proxy, you should ensure your `AndroidManifest.xml` points to a network security config if you are using a debug build.

The library already includes a default `network_security_config.xml` that whitelists `scorecardresearch.com`.

## Usage

### Initialization
Initialize the SDK as early as possible (e.g., in your root `App.tsx` or `index.js`).

```tsx
import Comscore from 'react-native-comscore';

// ...

useEffect(() => {
  Comscore.initialize({
    publisherId: "YOUR_PUBLISHER_ID",
    applicationName: "My App Name",
    initialConsent: "1", // "1" for opted-in, "0" for opted-out, "" for unknown
    usagePropertiesAutoUpdateMode: "foregroundOnly",
    validationMode: __DEV__, // Enable only in debug/development
  });
}, []);
```

### Tracking Sections
Notify Comscore when the user changes sections/screens.

```tsx
Comscore.trackSection("Home");
// or for general screens like splash:
Comscore.trackSection("");
```

### Updating Consent
If the user changes their consent preference during the session:

```tsx
Comscore.updateConsent("0"); // User opted out
```

### Background User Experience
If your app provides a background UX (e.g., audio playback):

```tsx
// When playback starts
Comscore.notifyUxActive();

// When playback stops
Comscore.notifyUxInactive();
```

## Validation
For detailed instructions on how to validate your implementation using Charles Proxy and Comscore's Validation Mode, see [VALIDATION.md](./VALIDATION.md).

## License

MIT
