import {
  IonContent,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from '@ionic/react';

import { useHistory, useLocation } from 'react-router-dom';
import { baseballOutline, baseballSharp, constructOutline, constructSharp, downloadOutline, downloadSharp,
  homeOutline,
  homeSharp,
  listOutline, listSharp, logOutOutline, logOutSharp, musicalNoteOutline, musicalNoteSharp, personCircleOutline,
  personCircleSharp, searchOutline, searchSharp } from 'ionicons/icons';
import './Menu.css';
import { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_SONGS_WITH_ISSUES_COUNT } from '../graphql/graphql';
import { RootState } from '../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../firebase';
import { setIssueCount } from '../store/slices/issueCountSlice';

const Menu: React.FC = () => {

  const [repairCount, setRepairCount] = useState<string>('0');

  const songsWithIssuesCount = useSelector((state: RootState) => state.issueCount.value);

  const history = useHistory();

  const dispatch = useDispatch();

  const [
    getIssueCount,
    { loading: loadingCount, error: errorCount, data: dataCount }
  ] = useLazyQuery(GET_SONGS_WITH_ISSUES_COUNT, {
    fetchPolicy: 'no-cache', nextFetchPolicy: 'no-cache', onCompleted: (data) => {
      setRepairCount(data.getSongsWithIssuesCount);
      dispatch(setIssueCount(data.getSongsWithIssuesCount));
    },
  });

  useEffect(() => {
    getIssueCount();
  }, []);

  useEffect(() => {
    setRepairCount(songsWithIssuesCount.toString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [songsWithIssuesCount]);

  const handleLogOut = () => {
    logout();
    history.push({pathname:'/page/Login'});
  };

  interface AppPage {
    url: string;
    iosIcon: string;
    mdIcon: string;
    title: string;
  }

  const appPages: AppPage[] = [
    {
      title: 'Home',
      url: '/page/Home',
      iosIcon: homeOutline,
      mdIcon: homeSharp
    },
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
    // {
    //   title: 'Generate Playlist',
    //   url: '/page/Playlist',
    //   iosIcon: listOutline,
    //   mdIcon: listSharp
    // },
    {
      title: 'My Profile',
      url: '/page/Profile',
      iosIcon: personCircleOutline,
      mdIcon: personCircleSharp
    },
    {
      title: 'Log Out',
      url: '/page/Login',
      iosIcon: logOutOutline,
      mdIcon: logOutSharp
    }
  ];

  const location = useLocation();

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonImg src="assets/images/sod.png" className='menu-logo' alt="Song of the day!"></IonImg>
          <IonListHeader>Song of the Day</IonListHeader>
          <IonNote>All the music that is fit to be played!</IonNote>
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url}
                  routerDirection="none" lines="none" detail={false} onClick={() => appPage.title == 'Log Out' ? handleLogOut() : undefined}>
                  <IonIcon slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
