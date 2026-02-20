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
  IonToast,
  IonModal,
  IonFooter,
  IonInput,
  IonButtons,
  IonSpinner,
} from '@ionic/react';

import {
  SuspiciousAppInfo,
  addToWhitelist,
  blockScreenCapture,
  isScreenCaptureBlocked,
  storeExternalId,
  removeExternalId,
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
  allChecksStatus: 'in progress' | 'completed';
}> = ({ checks, suspiciousApps, allChecksStatus }) => {
  const [screenCaptureBlocked, setScreenCaptureBlocked] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [showToast, setShowToast] = React.useState(false);
  const [externalIdValue, setExternalIdValue] = React.useState('');
  const [toastMessage, setToastMessage] = React.useState('');
  const [toastColor, setToastColor] = React.useState<'success' | 'warning'>('success');
  const platform = Capacitor.getPlatform();
  useEffect(() => {
    (async () => {
      if (platform === 'android') {
        await addItemsToMalwareWhitelist();
      }
      await updateScreenCaptureStatus();
    })();
  }, []);

  const addItemsToMalwareWhitelist = async () => {
    const appsToWhitelist = ['io.ionic.starter', 'com.example.myApp'];
    await Promise.all(
      appsToWhitelist.map(async (app) => {
        try {
          const whitelistResponse = await addToWhitelist(app);
          // eslint-disable-next-line no-console
          console.info(`${app} stored to Malware Whitelist: ${whitelistResponse}`);
        } catch (error) {
          // eslint-disable-next-line no-console
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
      // eslint-disable-next-line no-console
      console.error('Error fetching screen capture status:', error);
    }
  };

  const handleScreenCapture = async (enable: boolean) => {
    try {
      const blockScreenCaptureResponse = await blockScreenCapture(enable);
      // eslint-disable-next-line no-console
      console.info('Changing Screen Capture Status:', blockScreenCaptureResponse);
      await updateScreenCaptureStatus();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(`Failed to ${enable ? 'block' : 'enable'} screen capture: ${(e as Error).message}`);
    }
  };

  const handleModalDismiss = () => {
    setIsModalOpen(false);
  };

  const handleModalSend = async () => {
    try {
      await storeExternalId(externalIdValue);
      setToastColor('success');
      setToastMessage('External ID stored');
    } catch (error) {
      setToastColor('warning');
      setToastMessage(`Error while storing external ID: ${(error as Error).message}`);
    }

    setIsModalOpen(false);
    setShowToast(true);
  };

  const handleRemoveExternalId = async () => {
    try {
      await removeExternalId();
      setToastColor('success');
      setToastMessage('External ID removed');
    } catch (error) {
      setToastColor('warning');
      setToastMessage(`Error while removing external ID: ${(error as Error).message}`);
    }
    setShowToast(true);
  };

  return (
    <IonContent scrollY={true}>
      <IonModal isOpen={isModalOpen} onDidDismiss={handleModalDismiss}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Set External ID</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={handleModalDismiss}>Dismiss</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonContent>
          <div className="content-padding">
            <IonInput
              labelPlacement="floating"
              fill="solid"
              value={externalIdValue}
              placeholder="Type something..."
              onIonInput={(input) => setExternalIdValue(input.detail.value ?? '')}
            >
              <div slot="label">External ID</div>
            </IonInput>
          </div>

          <div className="centered-div">
            <IonButton onClick={handleModalSend}>Send</IonButton>
          </div>
        </IonContent>

        <IonFooter>
          <IonToolbar></IonToolbar>
        </IonFooter>
      </IonModal>

      <IonToast
        isOpen={showToast}
        message={toastMessage}
        duration={4000}
        position="bottom"
        color={toastColor}
        swipeGesture="vertical"
        onDidDismiss={() => setShowToast(false)}
      />

      <IonHeader>
        <IonToolbar>
          <IonTitle>Capacitor Demo</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonList>
        <IonRow className="centered-row">
          <IonButton
            className="ion-text-wrap features-button"
            color={screenCaptureBlocked ? 'danger' : 'primary'}
            onClick={() => handleScreenCapture(!screenCaptureBlocked)}
          >
            {screenCaptureBlocked ? 'Unblock Screen Capture' : 'Block Screen Capture'}
          </IonButton>
          <IonButton className="ion-text-wrap features-button" onClick={() => setIsModalOpen(true)}>
            Store External ID
          </IonButton>
          <IonButton className="ion-text-wrap features-button" onClick={handleRemoveExternalId}>
            Remove External ID
          </IonButton>
        </IonRow>
        <IonListHeader>
          <h1>RASP Execution State:</h1>
        </IonListHeader>
        <IonItem>
          <IonLabel color={allChecksStatus === 'completed' ? 'success' : 'primary'}>
            All checks finished
            <p className="checkDescription">{allChecksStatus}</p>
          </IonLabel>
          {allChecksStatus === 'completed' ? (
            <IonIcon icon={shieldCheckmarkOutline} color="success" size="large" slot="end" />
          ) : (
            <IonSpinner color="primary" slot="end" />
          )}
        </IonItem>
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
                <p className="checkDescription">{check.isSecure ? 'secure' : 'danger'} </p>
              </IonLabel>

              {check.name === 'Malware' && <MalwareModal isDisabled={check.isSecure} suspiciousApps={suspiciousApps} />}

              {check.isSecure ? (
                <IonIcon icon={shieldCheckmarkOutline} color="success" size="large" />
              ) : (
                <IonIcon icon={alertCircleOutline} color="danger" size="large" />
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
