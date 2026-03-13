# Comscore SDK Validation Guide

This guide explains how to validate your Comscore implementation.

## 1. Validation Mode
The library supports Comscore's "Implementation Validation Mode". When enabled, the SDK sends additional debug information.

**Warning:** Validation Mode must **NEVER** be enabled in production builds.

```tsx
Comscore.initialize({
  publisherId: "...",
  validationMode: true, // Should be false in production
});
```

## 2. Android Validation (Charles Proxy)
To see encrypted Comscore tags on Android 7.0+, you must whitelist the Comscore domain and trust the Charles Proxy certificate.

### Requirements:
1. **Network Security Config:** The library includes `android/src/main/res/xml/network_security_config.xml` which whitelists `scorecardresearch.com`.
2. **Charles Certificate:** 
   - Download the Charles root certificate from your PC (`Help -> SSL Proxying -> Save Charles root certificate...`).
   - Place it in your app's `android/app/src/main/res/raw/charles_ssl.crt` (you may need to rename it to `.crt` or `.pem`).
3. **Debug Build:** The configuration in this library only applies to `debug-overrides`.

## 3. iOS Validation
1. **Charles Proxy:** Install the Charles root certificate on your iOS device/simulator and enable "Full Trust" in `Settings -> General -> About -> Certificate Trust Settings`.
2. **SSL Proxying:** In Charles, add `*.scorecardresearch.com` to `Proxy -> SSL Proxying Settings`.

## 4. What to Look For
In Charles Proxy, look for requests to `https://sb.scorecardresearch.com`.
- Check for the `ns_category` label during `trackSection` calls.
- Check for the `cs_ucfr` label for consent.
- Check for `ns_ap_ev=start` during initialization.

For official validation, Comscore may request that you send them a build (APK/IPA) or invite them to TestFlight/App Center. Refer to `helpers/comscore-validation-guide.md` for UDIDs and email addresses.
