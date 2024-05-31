![FreeRasp](https://raw.githubusercontent.com/talsec/Free-RASP-Community/master/visuals/freeRASP.png)

![GitHub Repo stars](https://img.shields.io/github/stars/talsec/Free-RASP-Community?color=green) ![GitHub](https://img.shields.io/github/license/talsec/Free-RASP-Community) ![GitHub](https://img.shields.io/github/last-commit/talsec/Free-RASP-Community) ![Publisher](https://img.shields.io/pub/publisher/freerasp) [![42matters](https://42matters.com/badges/sdk-installations/talsec)](https://42matters.com/sdks/android/talsec)

[<img src="https://assets.42matters.com/badges/2024/04/rising-star.svg?m=04" width="100"/>](https://42matters.com/sdks/android/talsec)

# freeRASP for Capacitor

freeRASP for Capacitor is a mobile in-app protection and security monitoring plugin. It aims to cover the main aspects of RASP (Runtime App Self Protection) and application shielding.

# :notebook_with_decorative_cover: Table of contents

- [Overview](#overview)
- [Usage](#usage)
  - [Step 1: Install the plugin](#step-1-install-the-plugin)
  - [Step 2: Set up the dependencies](#step-2-set-up-the-dependencies)
  - [Step 3: Setup the configuration, callbacks and initialize freeRASP](#step-3-setup-the-configuration-callbacks-and-initialize-freerasp)
    - [Configuration](#configuration)
      - [Dev vs Release version](#dev-vs-release-version)
    - [Callbacks](#callbacks)
    - [Initialization](#initialization)
  - [Step 4: Additional note about obfuscation](#step-4-additional-note-about-obfuscation)
  - [Step 5: User Data Policies](#step-5-user-data-policies)
- [Security Report](#security-report)
- [Commercial versions (RASP+ and more)](#bar_chart-commercial-versions-rasp-and-more)
  - [Plans Comparison](#plans-comparison)
- [About Us](#about-us)
- [License](#license)

# Overview

The freeRASP is available for Flutter, Cordova, Capacitor, React Native, Android, and iOS developers. We encourage community contributions, investigations of attack cases, joint data research, and other activities aiming to make better app security and app safety for end-users.

freeRASP plugin is designed to combat

- Reverse engineering attempts
- Re-publishing or tampering with the apps
- Running application in a compromised OS environment
- Malware, fraudsters, and cybercriminal activities

Key features are the detection and prevention of

- Root/Jailbreak (e.g., unc0ver, check1rain)
- Hooking framework (e.g., Frida, Shadow)
- Untrusted installation method
- App/Device (un)binding

Additional freeRASP features include low latency, easy integration and a weekly [Security Report](#security-report) containing detailed information about detected incidents and potential threats, summarizing the state of your app security.

The commercial version provides a top-notch protection level, extra features, support and maintenance. One of the most valued commercial features is AppiCrypt® - App Integrity Cryptogram.

It allows easy to implement API protection and App Integrity verification on the backend to prevent API abuse:

- Bruteforce attacks
- Botnets
- Session-hijacking
- DDoS

It is a unified solution that works across all mobile platforms without dependency on external web services (i.e., without extra latency, an additional point of failure, and maintenance costs).

Learn more about commercial features at [https://talsec.app](https://talsec.app).

Learn more about freemium freeRASP features at [GitHub main repository](https://github.com/talsec/Free-RASP-Community).

# Usage

We will guide you step-by-step, but you can always check the expected result in the example folder.

## Step 1: Install the plugin

    $ npm install capacitor-freerasp
    $ npx cap sync

## Step 2: Set up the dependencies

### Android

freeRASP for Android requires a **minSdkVersion** level of **>=23** and a **targetSdkVersion** level of **>=33**. Some Capacitor projects, by default, support even lower levels of minimum and target SDKs. This creates an inconsistency we must solve by updating the SDK levels of the application:

1. From the root of your project, go to **android > variables.gradle** (or equivalent).
1. In **ext**, update **minSdkVersion** to at least **23** (Android 6.0) or higher and **compileSdkVersion** to **33** (Android 13).

```groovy
  ext {
    minSdkVersion 23
    compileSdkVersion 33
    ...
  }
```

## Step 3: Setup the configuration, callbacks and initialize freeRASP

### Import freeRASP

You should add freeRASP in the entry point to your app, which is usually `App.tsx` for React or `main.ts` for Vue or Angular projects.

```ts
import { startFreeRASP } from 'capacitor-freerasp';
```

### Configuration

You need to provide configuration for freeRASP to work properly and initialize it. The freeRASP configuration is an JavaScript object that contains configs for both Android and iOS, as well as common configuration. You must fill all the required values for the plugin to work. Use the following template to provide configuration to the Talsec plugin. You can find detailed description of the configuration below.

```ts
// app configuration
const config = {
  androidConfig: {
    packageName: 'com.capacitor.example',
    certificateHashes: ['yourSigningCertificateHashBase64'],
    supportedAlternativeStores: ['com.sec.android.app.samsungapps'],
  },
  iosConfig: {
    appBundleId: 'com.capacitor.example',
    appTeamId: 'yourTeamID',
  },
  watcherMail: 'yourEmailAddress@example.com',
  isProd: true,
};
```

#### The configuration object should consist of:

1. `androidConfig` _: object | undefined_ - required for Android devices, has following keys:

   - `packageName` _: string_ - package name of your app you chose when you created it
   - `certificateHashes` _: string[]_ - hash of the certificate of the key which was used to sign the application. **Hash which is passed here must be encoded in Base64 form.** If you are not sure how to get your certificate hash, you can check out the guide on our [Github wiki](https://github.com/talsec/Free-RASP-Community/wiki/Getting-your-signing-certificate-hash-of-app). Multiple hashes are supported, e.g. if you are using a different one for the Huawei App Gallery.
   - `supportedAlternativeStores` _: string[] | undefined_ - Google Play Store and Huawei AppGallery are supported out of the box, you **don't have to assign anything**. You can add other stores like the Samsung Galaxy Store in the example code (`com.sec.android.app.samsungapps`). For more information, visit the [Detecting Unofficial Installation](https://github.com/talsec/Free-RASP-Community/wiki/Threat-detection#detecting-unofficial-installation) wiki page.

1. `iosConfig` _: object | undefined_ - required for iOS devices, has following keys:
   - `appBundleId` _: string_ - Bundle ID of your app
   - `appTeamId` _: string_ - the Apple Team ID
1. `watcherMail` _: string_ - your mail address where you wish to receive reports. Mail has a strict form `name@domain.com` which is passed as String.
1. `isProd` _: boolean | undefined_ - defaults to `true` when undefined. If you want to use the Dev version to disable checks described [in the chapter below](#dev-vs-release-version), set the parameter to `false`. Make sure that you have the Release version in the production (i.e. isProd set to true)!

If you are developing only for one of the platforms, you can skip the configuration part for the other one, i.e., delete the unused configuration.

#### Dev vs Release version

The Dev version is used to not complicate the development process of the application, e.g. if you would implement killing of the application on the debugger callback. It disables some checks which won't be triggered during the development process:

- Emulator-usage (simulator)
- Debugging (debug)
- Signing (appIntegrity)
- Unofficial store (unofficialStore)

### Callbacks

freeRASP executes periodical checks when the application is running. Handle the detected threats in the **listeners**. For example, you can log the event, show a window to the user or kill the application. [Visit our wiki](https://github.com/talsec/Free-RASP-Community/wiki/Threat-detection) to learn more details about the performed checks and their importance for app security.

```ts
// reactions for detected threats
const actions = {
  // Android & iOS
  privilegedAccess: () => {
    console.log('privilegedAccess');
  },
  // Android & iOS
  debug: () => {
    console.log('debug');
  },
  // Android & iOS
  simulator: () => {
    console.log('simulator');
  },
  // Android & iOS
  appIntegrity: () => {
    console.log('appIntegrity');
  },
  // Android & iOS
  unofficialStore: () => {
    console.log('unofficialStore');
  },
  // Android & iOS
  hooks: () => {
    console.log('hooks');
  },
  // Android & iOS
  deviceBinding: () => {
    console.log('deviceBinding');
  },
  // Android & iOS
  secureHardwareNotAvailable: () => {
    console.log('secureHardwareNotAvailable');
  },
  // Android & iOS
  systemVPN: () => {
    console.log('systemVPN');
  },
  // Android & iOS
  passcode: () => {
    console.log('passcode');
  },
  // iOS only
  deviceID: () => {
    console.log('deviceID');
  },
  // Android only
  obfuscationIssues: () => {
    console.log('obfuscationIssues');
  },
  // Android only
  devMode: () => {
    console.log('devMode');
  },
};
```

### Initialization

Provide the configuration and reactions to threats you set up in previous steps.

```ts
// returns `true` if freeRASP starts successfully; you can ignore this value
const started = await startFreeRASP(config, actions);
```

Based on your framework, we recommend:

- In **React**: Wrap this function in `useEffect` with empty dependency array
- In **Vue**: Call the method inside the `mounted` property
- In **Angular**: Call the method inside the `ngOnInit` method

## Step 4: Additional note about obfuscation

The freeRASP contains public API, so the integration process is as simple as possible. Unfortunately, this public API also creates opportunities for the attacker to use publicly available information to interrupt freeRASP operations or modify your custom reaction implementation in threat callbacks. In order to provide as much protection as possible, freeRASP obfuscates its source code. However, if all other code is not obfuscated, one can easily deduct that the obfuscated code belongs to a security library. We, therefore, encourage you to apply code obfuscation to your app, making the public API more difficult to find and also partially randomized for each application so it cannot be automatically abused by generic hooking scripts.

Probably the easiest way to obfuscate your app is via code minification, a technique that reduces the size of the compiled code by removing unnecessary characters, whitespace, and renaming variables and functions to shorter names. It can be configured for Android devices in **android/app/build.gradle** like so:

```groovy
android {
    buildTypes {
        release {
            ...
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

Please note that some other modules in your app may rely on reflection, therefore it may be necessary to add corresponding keep rules into `proguard-rules.pro` file.

If there is a problem with the obfuscation, freeRASP will notify you about it via `obfuscationIssues` callback.

You can read more about Android obfuscation in the official documentation:

- https://developer.android.com/studio/build/shrink-code
- https://www.guardsquare.com/manual/configuration/usage

## Step 5: User Data Policies

See the generic info about freeRASP data collection [here](https://github.com/talsec/Free-RASP-Community/tree/master#data-collection-processing-and-gdpr-compliance).

Google Play [requires](https://support.google.com/googleplay/android-developer/answer/10787469?hl=en) all app publishers to declare how they collect and handle user data for the apps they publish on Google Play. They should inform users properly of the data collected by the apps and how the data is shared and processed. Therefore, Google will reject the apps which do not comply with the policy.

Apple has a [similar approach](https://developer.apple.com/app-store/app-privacy-details/) and specifies the types of collected data.

You should also visit our [Android](https://github.com/talsec/Free-RASP-Android) and [iOS](https://github.com/talsec/Free-RASP-iOS) submodules to learn more about their respective data policies.

And you're done 🎉!

# Security Report

The Security Report is a weekly summary describing the application's security state and characteristics of the devices it runs on in a practical and easy-to-understand way.

The report provides a quick overview of the security incidents, their dynamics, app integrity, and reverse engineering attempts. It contains info about the security of devices, such as OS version or the ratio of devices with screen locks and biometrics. Each visualization also comes with a concise explanation.

To receive Security Reports, fill out the _watcherMail_ field in [config](#configuration).

![dashboard](https://raw.githubusercontent.com/talsec/Free-RASP-Community/master/visuals/dashboard.png)

# :bar_chart: Commercial versions (RASP+ and more)

We provide app security hardening SDK: i.e. AppiCrypt®, Customer Data Encryption (local storage), End-to-end encryption, Strings protection (e.g. API keys) and Dynamic Certificate Pinning to our commercial customers as well. To get the most advanced protection compliant with PSD2 RT and eIDAS and support from our experts, contact us at [talsec.app](https://talsec.app).

The commercial version provides a top-notch protection level, extra features, support, and maintenance. One of the most valued commercial features is [AppiCrypt®](https://www.talsec.app/appicrypt) - App Integrity Cryptogram.

It allows easy to implement API protection and App Integrity verification on the backend to prevent API abuse:

- Bruteforce attacks
- Botnets
- Session-hijacking
- DDoS

It is a unified solution that works across all mobile platforms without dependency on external web services (i.e., without extra latency, an additional point of failure, and maintenance costs).

Learn more about commercial features at [https://talsec.app](https://talsec.app/).

**TIP:** You can try freeRASP and then upgrade easily to an enterprise service.

## Plans Comparison

<i>
freeRASP is freemium software i.e. there is a Fair Usage Policy (FUP) that impose some limitations on the free usage. See the FUP section in the table below
</i>
<br/>
<br/>
<table>
    <thead>
        <tr>
            <th></th>
            <th>freeRASP</th>
            <th>Business RASP+</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td colspan=5><strong>Runtime App Self Protection (RASP, app shielding)</strong></td>
        </tr>
        <tr>
            <td>Advanced root/jailbreak protections (including Magisk)</td>
            <td>basic</td>
            <td>advanced</td>
        </tr>
        <tr>
            <td>Runtime reverse engineering controls 
                <ul>
                    <li>Debugger</li>
                    <li>Emulator / Simulator</li>
                    <li>Hooking and reversing frameworks (e.g. Frida, Magisk, XPosed, Cydia Substrate and more)</li>
                </ul>
            </td>
            <td>basic</td>
            <td>advanced</td>
        </tr>
        <tr>
            <td>Runtime integrity controls 
                <ul>
                    <li>Tampering protection</li>
                    <li>Repackaging / Cloning protection</li>
                    <li>Device binding protection</li>
                    <li>Unofficial store detection</li>
                </ul>
            </td>
            <td>basic</td>
            <td>advanced</td>
        </tr>
        <tr>
            <td>Device OS security status check 
                <ul>
                    <li>HW security module control</li>
                    <li>Screen lock control</li>
                    <li>Google Play Services enabled/disabled</li>
                    <li>Last security patch update</li>
                    <li>System VPN control</li>
                    <li>Developer mode control</li>
                </ul>
            </td>
            <td>yes</td>
            <td>yes</td>
        </tr>
        <tr>
            <td>UI protection 
                <ul>
                    <li>Overlay protection</li>
                    <li>Accessibility services misuse protection</li>
                </ul>
            </td>
            <td>no</td>
            <td>yes</td>
        </tr>
        <tr>
            <td colspan=5><strong>Hardening suite</strong></td>
        </tr>
        <tr>
            <td>Security hardening suite 
                <ul>                
                    <li>End-to-end encryption</li>
                    <li>Strings protection (e.g. API keys)</li>
                    <li>Dynamic TLS certificate pinning</li>
                </ul>
            </td>
            <td>no</td>
            <td>yes</td>
        </tr>
        <tr>
            <td colspan=5><strong>AppiCrypt® - App Integrity Cryptogram</strong></td>
        </tr>
        <tr>
            <td>API protection by mobile client integrity check, online risk scoring, online fraud prevention, client App integrity check. The cryptographic proof of app & device integrity.</td>
            <td>no</td>
            <td>yes</td>
        </tr>
        <tr>
            <td colspan=5><strong>Security events data collection, Auditing and Monitoring tools</strong></td>
        </tr>
        <tr>
            <td>Threat events data collection from SDK</td>
            <td>yes</td>
            <td>configurable</td>
        </tr>
        <tr>
            <td>AppSec regular email reporting service</td>
            <td>yes (up to 100k devices)</td>
            <td>yes</td>
        </tr>
        <tr>
            <td>UI portal for Logging, Data analytics and auditing</td>
            <td>no</td>
            <td>yes</td>
        </tr>
        <tr>     
          <td colspan=5><strong>Support and Maintenance</strong></td>
        </tr>
        <tr>
            <td>SLA</td>
            <td>Not committed</td>
            <td>yes</td>
        </tr>
        <tr>
            <td>Maintenance updates</td>
            <td>Not committed</td>
            <td>yes</td>
        </tr>
        <tr>
            <td colspan=5><strong>Fair usage policy</strong></td>
        </tr>
        <tr>
            <td>Mentioning of the App name and logo in the marketing communications of Talsec (e.g. "Trusted by" section on the web).</td>
            <td>over 100k downloads</td>
            <td>no</td>
        </tr>
        <tr>
            <td>Threat signals data collection to Talsec database for processing and product improvement</td>
            <td>yes</td>
            <td>no</td>
        </tr>
    </tbody>
</table>

For further comparison details (and planned features), follow our [discussion](https://github.com/talsec/Free-RASP-Community/discussions/5).

# About Us

Talsec is an academic-based and community-driven mobile security company. We deliver in-App Protection and a User Safety suite for Fintechs. We aim to bridge the gaps between the user's perception of app safety and the strong security requirements of the financial industry.

Talsec offers a wide range of security solutions, such as App and API protection SDK, Penetration testing, monitoring services, and the User Safety suite. You can check out offered products at [our web](https://www.talsec.app).

# License

This project is provided as freemium software i.e. there is a fair usage policy that impose some limitations on the free usage. The SDK software consists of opensource and binary part which is property of Talsec. The opensource part is licensed under the MIT License - see the [LICENSE](https://github.com/talsec/Free-RASP-Community/blob/master/LICENSE) file for details.
