import React, { useEffect, useState } from 'react';
import { IonApp, setupIonicReact } from '@ionic/react';
import FreeRaspDemo from './pages/FreeRaspDemo';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';

import {
  startFreeRASP,
  startOngoingCallDetection,
  SuspiciousAppInfo,
  addToWhitelist,
  type CallState,
} from 'capacitor-freerasp';
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

const callStateLabel = (state: CallState) => state.charAt(0) + state.slice(1).toLowerCase();

const App: React.FC = () => {
  const [appChecks, setAppChecks] = useState([
    ...commonChecks,
    ...(Capacitor.getPlatform() === 'ios' ? iosChecks : androidChecks),
  ]);

  const [suspiciousApps, setSuspiciousApps] = React.useState<
    SuspiciousAppInfo[]
  >([]);

  const [allChecksStatus, setAllChecksStatus] = useState<
    'in progress' | 'completed'
    >('in progress');

  const [postponedChecksStatus, setPostponedChecksStatus] = useState<
    'in progress' | 'completed'
  >('in progress');

  const config = {
    androidConfig: {
      packageName: 'io.ionic.starter',
      certificateHashes: ['AKoRuyLMM91E7lX/Zqp3u4jMmd0A7hH/Iqozu0TMVd0='],
      // supportedAlternativeStores: ['storeOne', 'storeTwo'],
      suspiciousAppDetectionConfig: {
        packageNames: ['io.ionic.starter'],
        hashes: ['FgvSehLMM91E7lX/Zqp3u4jMmd0A7hH/Iqozu0TMVd0u'],
        requestedPermissions: [
          [
            'android.permission.INTERNET',
            'android.permission.ACCESS_COARSE_LOCATION',
          ],
          ['android.permission.BLUETOOTH'],
          ['android.permission.BATTERY_STATS'],
        ],
        scanScope: {
          scopeType: 'SIDELOADED_ONLY',
          trustedInstallSources: ['com.apkpure.aegon'],
        },
      },
    },
    iosConfig: {
      appBundleIds: ['io.ionic.starter'],
      appTeamId: 'your_team_ID',
    },
    watcherMail: 'your_email_address@example.com',
    isProd: true,
    killOnBypass: true,
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
    // Android only
    adbEnabled: () => {
      setAppChecks(currentState =>
        currentState.map(threat =>
          threat.name === 'ADB Enabled'
            ? { ...threat, isSecure: false }
            : threat,
        ),
      );
    },
    // Android & iOS
    screenshot: () => {
      setAppChecks(currentState =>
        currentState.map(threat =>
          threat.name === 'Screenshot'
            ? { ...threat, isSecure: false }
            : threat,
        ),
      );
    },
    // Android & iOS
    screenRecording: () => {
      setAppChecks(currentState =>
        currentState.map(threat =>
          threat.name === 'Screen Recording'
            ? { ...threat, isSecure: false }
            : threat,
        ),
      );
    },
    // Android only
    multiInstance: () => {
      setAppChecks(currentState =>
        currentState.map(threat =>
          threat.name === 'Multi Instance'
            ? { ...threat, isSecure: false }
            : threat,
        ),
      );
    },
  // Android only
    timeSpoofing: () => {
      setAppChecks(currentState =>
        currentState.map(threat =>
          threat.name === 'Time spoofing'
            ? { ...threat, isSecure: false }
            : threat,
        ),
      );
    },
    // Android only
    locationSpoofing: () => {
      setAppChecks(currentState =>
        currentState.map(threat =>
          threat.name === 'Location spoofing'
            ? { ...threat, isSecure: false }
            : threat,
        ),
      );
    },
    // Android only
    unsecureWifi: () => {
      setAppChecks(currentState =>
        currentState.map(threat =>
          threat.name === 'Unsecure Wi-Fi'
            ? { ...threat, isSecure: false }
            : threat,
        ),
      );
    },
    // Android only
    automation: () => {
      setAppChecks(currentState =>
        currentState.map(threat =>
          threat.name === 'Automation'
            ? { ...threat, isSecure: false }
            : threat,
        ),
      );
    },
    // Android only
    bootloader: () => {
      setAppChecks(currentState =>
        currentState.map(threat =>
          threat.name === 'Bootloader'
            ? { ...threat, isSecure: false }
            : threat,
        ),
      );
    },
    // Android only
    ongoingCall: (state: CallState) => {
      // eslint-disable-next-line no-console
      console.log('freeRASP: Ongoing call', state);
      setAppChecks(currentState =>
        currentState.map(threat =>
          threat.name === 'Ongoing Call'
            ? { ...threat, isSecure: state === 'STOPPED', detail: callStateLabel(state) }
            : threat,
        ),
      );
    },
  
  };
  

  const raspExecutionStateActions = {
    fastChecksFinished: () => {
      setAllChecksStatus('completed');
      // eslint-disable-next-line no-console
      console.log('freeRASP: Fast checks finished');
    },
    // Android only
    postponedChecksFinished: () => {
      setPostponedChecksStatus('completed');
      // eslint-disable-next-line no-console
      console.log('freeRASP: Postponed checks finished');
    },
  };

  // start freeRASP
  useEffect(() => {
    (async () => {
      try {
        await startFreeRASP(config, actions, raspExecutionStateActions);
        // eslint-disable-next-line no-console
        console.log('Talsec started');
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Talsec failed to start:', error);
      }
    })();

    if (Capacitor.getPlatform() === 'android') {
      // Report cellular and VoIP calls through the ongoingCall action
      startOngoingCallDetection();
      addToWhitelist('com.example.myApp');
      Geolocation.requestPermissions().then((permission) => {
        // eslint-disable-next-line no-console
        console.log('Location permissions:', permission);
      });
    }
  }, []);

  return (
    <IonApp>
      <FreeRaspDemo
        checks={appChecks}
        suspiciousApps={suspiciousApps}
        allChecksStatus={allChecksStatus}
        postponedChecksStatus={postponedChecksStatus}
      />
    </IonApp>
  );
};

export default App;
