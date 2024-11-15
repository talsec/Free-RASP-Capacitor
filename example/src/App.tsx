import React, { useEffect, useState } from 'react';
import { IonApp, setupIonicReact } from '@ionic/react';
import FreeRaspDemo from './pages/FreeRaspDemo';
import { Capacitor } from '@capacitor/core';

import { startFreeRASP, SuspiciousAppInfo } from 'capacitor-freerasp';
import { androidChecks, commonChecks, iosChecks } from './utils/checks';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => {
  const [appChecks, setAppChecks] = useState([
    ...commonChecks,
    ...(Capacitor.getPlatform() === 'ios' ? iosChecks : androidChecks),
  ]);

  const [suspiciousApps, setSuspiciousApps] = React.useState<
    SuspiciousAppInfo[]
  >([]);

  const config = {
    androidConfig: {
      packageName: 'com.capacitor.example',
      certificateHashes: ['AKoRuyLMM91E7lX/Zqp3u4jMmd0A7hH/Iqozu0TMVd0='],
      // supportedAlternativeStores: ['storeOne', 'storeTwo'],
      malwareConfig: {
        blacklistedHashes: ['FgvSehLMM91E7lX/Zqp3u4jMmd0A7hH/Iqozu0TMVd0u'],
        blacklistedPackageNames: ['com.wultra.app.screenlogger'],
        suspiciousPermissions: [
          [
            'android.permission.INTERNET',
            'android.permission.ACCESS_COARSE_LOCATION',
          ],
          ['android.permission.BLUETOOTH'],
          ['android.permission.BATTERY_STATS'],
        ],
        whitelistedInstallationSources: ['com.apkpure.aegon'],
      },
    },
    iosConfig: {
      appBundleId: 'com.capacitor.example',
      appTeamId: 'your_team_ID',
    },
    watcherMail: 'your_email_address@example.com',
    isProd: true,
  };

  const actions = {
    // Android & iOS
    privilegedAccess: () => {
      setAppChecks(currentState =>
        currentState.map(threat =>
          threat.name === 'Privileged Access'
            ? { ...threat, isSecure: false }
            : threat,
        ),
      );
    },
    // Android & iOS
    debug: () => {
      setAppChecks(currentState =>
        currentState.map(threat =>
          threat.name === 'Debug' ? { ...threat, isSecure: false } : threat,
        ),
      );
    },
    // Android & iOS
    simulator: () => {
      setAppChecks(currentState =>
        currentState.map(threat =>
          threat.name === 'Simulator' ? { ...threat, isSecure: false } : threat,
        ),
      );
    },
    // Android & iOS
    appIntegrity: () => {
      setAppChecks(currentState =>
        currentState.map(threat =>
          threat.name === 'App Integrity'
            ? { ...threat, isSecure: false }
            : threat,
        ),
      );
    },
    // Android & iOS
    unofficialStore: () => {
      setAppChecks(currentState =>
        currentState.map(threat =>
          threat.name === 'Unofficial Store'
            ? { ...threat, isSecure: false }
            : threat,
        ),
      );
    },
    // Android & iOS
    hooks: () => {
      setAppChecks(currentState =>
        currentState.map(threat =>
          threat.name === 'Hooks' ? { ...threat, isSecure: false } : threat,
        ),
      );
    },
    // Android & iOS
    deviceBinding: () => {
      setAppChecks(currentState =>
        currentState.map(threat =>
          threat.name === 'Device Binding'
            ? { ...threat, isSecure: false }
            : threat,
        ),
      );
    },
    // Android & iOS
    secureHardwareNotAvailable: () => {
      setAppChecks(currentState =>
        currentState.map(threat =>
          threat.name === 'Secure Hardware Not Available'
            ? { ...threat, isSecure: false }
            : threat,
        ),
      );
    },
    // Android & iOS
    systemVPN: () => {
      setAppChecks(currentState =>
        currentState.map(threat =>
          threat.name === 'System VPN'
            ? { ...threat, isSecure: false }
            : threat,
        ),
      );
    },
    // Android & iOS
    passcode: () => {
      setAppChecks(currentState =>
        currentState.map(threat =>
          threat.name === 'Passcode' ? { ...threat, isSecure: false } : threat,
        ),
      );
    },
    // iOS only
    deviceID: () => {
      setAppChecks(currentState =>
        currentState.map(threat =>
          threat.name === 'Device ID' ? { ...threat, isSecure: false } : threat,
        ),
      );
    },
    // Android only
    obfuscationIssues: () => {
      setAppChecks(currentState =>
        currentState.map(threat =>
          threat.name === 'Obfuscation Issues'
            ? { ...threat, isSecure: false }
            : threat,
        ),
      );
    },
    // Android only
    devMode: () => {
      setAppChecks(currentState =>
        currentState.map(threat =>
          threat.name === 'Developer Mode'
            ? { ...threat, isSecure: false }
            : threat,
        ),
      );
    },
    // Android only
    malware: (detectedApps: SuspiciousAppInfo[]) => {
      setSuspiciousApps(detectedApps);
      setAppChecks(currentState =>
        currentState.map(threat =>
          threat.name === 'Malware' ? { ...threat, isSecure: false } : threat,
        ),
      );
    },
  };

  // start freeRASP
  useEffect(() => {
    (async () => {
      const response = await startFreeRASP(config, actions);
      // eslint-disable-next-line no-console
      console.log('Talsec started:', response);
    })();
  }, []);

  return (
    <IonApp>
      <FreeRaspDemo checks={appChecks} suspiciousApps={suspiciousApps} />
    </IonApp>
  );
};

export default App;
