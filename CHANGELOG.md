# freeRASP 1.2.0

- ⚡ Improved message passing between native iOS/Android and Capacitor
- ✔️ Restricted message passing to valid callbacks only. If an invalid callback is received, the SDK will kill the app
- ⚡ Improved reaction obfuscation
- 📄 Documentation updates and improvements

### Android

- ⚡ Fixed ProviderException which could be occassionally triggered

### iOS

- ❗ Raised supported Xcode version to 14.3.1
- ⚡ Improved SDK obfuscation

# freeRASP 1.1.0

- 📄 Documentation updates and improvements

### Android

- ✔️ updated CA bundle for logging pinning
- ✔️ added error logging of network issues within the logging process
- ✔️ added retry politics for logging
- ⚡ fixed issue with DeadObjectException on Android 5 and 6 caused by excessive PackageManager.queryIntentActivities() usage
- ⚡ improved root detection capabilities

# freeRASP 1.0.0

- 🎉 Initial release of freeRASP for Capacitor
- ℹ️ Based on _Android freeRASP SDK 8.2.0_ and _iOS freeRASP SDK 5.1.0_
