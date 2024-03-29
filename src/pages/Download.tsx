import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Download.css';
import {
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
import FabToSubmit from '../components/FabToSubmit';
import { cloudDownloadOutline } from 'ionicons/icons';
import { useState } from 'react';
import ErrorDisplay from '../components/ErrorDisplay';

const Download: React.FC = () => {

  const [errorDetail, setErrorDetail] = useState<TypeError>();

  const token = localStorage.getItem('token');
  const downloadSongs = () => {
    fetch(`${process.env.REACT_APP_API_ENDPOINT_DOWNLOAD}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/csv',
        'authorization': `Bearer ${token}`,
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        // Create blob link to download
        const url = window.URL.createObjectURL(
          new Blob([blob]),
        );
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
          'download',
          `songs.csv`,
        );

        // Append to html link element page
        document.body.appendChild(link);

        // Start download
        link.click();

        // Clean up and remove the link
        link.parentNode!.removeChild(link);
      }).catch((error) => {
        setErrorDetail(error);
        console.log('in Catch block: ', error);
      });
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Download Songs</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Download CSV</IonTitle>
          </IonToolbar>
        </IonHeader>
          {
            errorDetail != null ? <ErrorDisplay message={errorDetail.message} detail={errorDetail.stack} /> :
          <IonGrid>

            {/* Temp hack to replace css for top margin */}
            <IonRow>
              <IonCol>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonButton size="small" onClick={() => downloadSongs()}>
                   Download All Songs
                  <IonIcon slot="end" icon={cloudDownloadOutline}></IonIcon>
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
          }
          <FabToSubmit/>
      </IonContent>
    </IonPage>
  );
};

export default Download;
