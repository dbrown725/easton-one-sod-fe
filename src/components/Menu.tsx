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
import { baseballOutline, baseballSharp, constructOutline, constructSharp, downloadOutline, downloadSharp, listOutline, listSharp, musicalNoteOutline, musicalNoteSharp, personCircleOutline, personCircleSharp, searchOutline, searchSharp } from 'ionicons/icons';
import './Menu.css';
import { useEffect, useState } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';
import { GET_SONGS_WITH_ISSUES_COUNT } from '../graphql/graphql';
import { RootState } from '../store/store';
import { useSelector } from 'react-redux';



const labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

const Menu: React.FC = () => {

  const [repairCount, setRepairCount] = useState<string>('0');

  const songsWithIssuesCount = useSelector((state: RootState) => state.issueCount.value);

  const [
    getIssueCount,
    { loading: loadingCount, error: errorCount, data: dataCount }
  ] = useLazyQuery(GET_SONGS_WITH_ISSUES_COUNT, {
    fetchPolicy: 'no-cache', nextFetchPolicy: 'no-cache', onCompleted: (data) => {
      setRepairCount(data.getSongsWithIssuesCount);
    },
  });

  useEffect(() => {
    getIssueCount();
  }, []);

  useEffect(() => {
    setRepairCount(songsWithIssuesCount.toString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [songsWithIssuesCount]);

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
      title: 'Archives',
      url: '/page/Archives',
      iosIcon: searchOutline,
      mdIcon: searchSharp
    },
    {
      title: 'My Bullpen',
      url: '/page/Bullpen',
      iosIcon: baseballOutline,
      mdIcon: baseballSharp
    },
    {
      title: 'Repair Shop - ' + repairCount + ' waiting',
      url: '/page/Repair',
      iosIcon: constructOutline,
      mdIcon: constructSharp
    },
    {
      title: 'Download Songs',
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

  const location = useLocation();

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>Song of the Day</IonListHeader>
          <IonNote>All the music that is fit to be played!</IonNote>
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
