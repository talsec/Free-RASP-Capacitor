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
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import { SuspiciousAppInfo, addToWhitelist } from 'capacitor-freerasp';
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
  useEffect(() => {
    (async () => {
      Capacitor.getPlatform() === 'android' &&
        (await addItemsToMalwareWhitelist());
    })();
  }, []);

  const addItemsToMalwareWhitelist = async () => {
    const appsToWhitelist = ['io.ionic.starter', 'com.example.myApp'];
    appsToWhitelist.forEach(async app => {
      try {
        const whitelistResponse = await addToWhitelist(app);
        console.info(
          `${app} stored to Malware Whitelist: ${whitelistResponse}`,
        );
      } catch (error: any) {
        console.info('Malware whitelist failed: ', error);
      }
    });
  };

  return (
    <IonContent scrollY={true}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Capacitor Demo</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonList>
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
