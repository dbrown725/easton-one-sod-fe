import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from '@ionic/react';

import { useLocation } from 'react-router-dom';
import { baseballOutline, baseballSharp, cloudUploadOutline, cloudUploadSharp, downloadOutline, downloadSharp, listOutline, listSharp, musicalNoteOutline, musicalNoteSharp, personCircleOutline, personCircleSharp, searchOutline, searchSharp } from 'ionicons/icons';
import './Menu.css';

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: 'Latest songs',
    url: '/page/Latest',
    iosIcon: musicalNoteOutline,
    mdIcon: musicalNoteSharp
  },
  {
    title: 'Search Song Archives',
    url: '/page/Archives',
    iosIcon: searchOutline,
    mdIcon: searchSharp
  },
  {
    title: 'Submit a Song',
    url: '/page/Submit',
    iosIcon: cloudUploadOutline,
    mdIcon: cloudUploadSharp
  },
  {
    title: 'My Song Bullpen',
    url: '/page/Bullpen',
    iosIcon: baseballOutline,
    mdIcon: baseballSharp
  },
  {
    title: 'Download CSV',
    url: '/page/Download',
    iosIcon: downloadOutline,
    mdIcon: downloadSharp
  },
  {
    title: 'Generate Playlist',
    url: '/page/Playlist',
    iosIcon: listOutline,
    mdIcon: listSharp
  },
  {
    title: 'My Profile',
    url: '/page/Profile',
    iosIcon: personCircleOutline,
    mdIcon: personCircleSharp
  }
];

const labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

const Menu: React.FC = () => {
  const location = useLocation();

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>Song of the Day</IonListHeader>
          <IonNote>All the music that is fit to play!</IonNote>
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                  <IonIcon slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>
{/* 
        <IonList id="labels-list">
          <IonListHeader>Labels</IonListHeader>
          {labels.map((label, index) => (
            <IonItem lines="none" key={index}>
              <IonIcon slot="start" icon={bookmarkOutline} />
              <IonLabel>{label}</IonLabel>
            </IonItem>
          ))}
        </IonList> */}
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
