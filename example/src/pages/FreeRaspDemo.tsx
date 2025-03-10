import * as React from 'react';
import { shieldCheckmarkOutline, alertCircleOutline } from 'ionicons/icons';
import TalsecLogo from '../assets/talsec-logo.png';
import './FreeRaspDemo.css';
import '../theme/variables.css';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonRow,
  IonButton,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import {
  SuspiciousAppInfo,
  addToWhitelist,
  blockScreenCapture,
  isScreenCaptureBlocked,
} from 'capacitor-freerasp';
import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import MalwareModal from '../components/MalwareModal';

const FreeRaspDemo: React.FC<{
  checks: {
    name: string;
    isSecure: boolean;
  }[];
  suspiciousApps: SuspiciousAppInfo[];
}> = ({ checks, suspiciousApps }) => {
  const [screenCaptureBlocked, setScreenCaptureBlocked] = React.useState(false);
  const platform = Capacitor.getPlatform();
  useEffect(() => {
    (async () => {
      if (platform === 'android') {
        await addItemsToMalwareWhitelist();
        await updateScreenCaptureStatus();
      }
    })();
  }, []);

  const addItemsToMalwareWhitelist = async () => {
    const appsToWhitelist = ['io.ionic.starter', 'com.example.myApp'];
    await Promise.all(
      appsToWhitelist.map(async app => {
        try {
          const whitelistResponse = await addToWhitelist(app);
          console.info(
            `${app} stored to Malware Whitelist: ${whitelistResponse}`,
          );
        } catch (error) {
          console.info('Malware whitelist failed: ', error);
        }
      }),
    );
  };

  const updateScreenCaptureStatus = async () => {
    try {
      const isBlocked = await isScreenCaptureBlocked();
      setScreenCaptureBlocked(isBlocked);
    } catch (error) {
      console.error('Error fetching screen capture status:', error);
    }
  };

  const handleScreenCapture = async (enable: boolean) => {
    try {
      const blockScreenCaptureResponse = await blockScreenCapture(enable);
      console.info(
        'Changing Screen Capture Status:',
        blockScreenCaptureResponse,
      );
      await updateScreenCaptureStatus();
    } catch (e: any) {
      console.error(
        `Failed to ${enable ? 'block' : 'enable'} screen capture: ${e.message}`,
      );
    }
  };

  return (
    <IonContent scrollY={true}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Capacitor Demo</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonList>
        {platform === 'android' && (
          <>
            <IonRow className="centered-row">
              <IonButton
                className="ion-text-wrap button"
                color={screenCaptureBlocked ? 'success' : 'danger'}
                onClick={() => handleScreenCapture(!screenCaptureBlocked)}
              >
                {screenCaptureBlocked
                  ? 'Unblock Screen Capture'
                  : 'Block Screen Capture'}
              </IonButton>
            </IonRow>
          </>
        )}
        <IonListHeader>
          <h1>freeRASP checks:</h1>
        </IonListHeader>

        {checks.map(
          (
            check: {
              name: string;
              isSecure: boolean;
            },
            idx: number,
          ) => (
            <IonItem key={idx}>
              <IonLabel color={check.isSecure ? 'success' : 'danger'}>
                {check.name}
                <p>{check.isSecure ? 'secure' : 'danger'} </p>
              </IonLabel>

              {check.name === 'Malware' && (
                <MalwareModal
                  isDisabled={check.isSecure}
                  suspiciousApps={suspiciousApps}
                />
              )}

              {check.isSecure ? (
                <IonIcon
                  icon={shieldCheckmarkOutline}
                  color="success"
                  size="large"
                />
              ) : (
                <IonIcon
                  icon={alertCircleOutline}
                  color="danger"
                  size="large"
                />
              )}
            </IonItem>
          ),
        )}
      </IonList>
      <IonRow>
        <IonImg className="talsecLogo" src={TalsecLogo} alt="Talsec logo" />
      </IonRow>
    </IonContent>
  );
};

export default FreeRaspDemo;
