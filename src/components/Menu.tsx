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
import { role, logout, refreshRole } from '../firebase';
import { useEffect, useRef } from 'react';

const Menu: React.FC = () => {

  const history = useHistory();

  const location = useLocation();

  const menuRef = useRef<HTMLIonMenuElement>(null);

  useEffect(() => {
    refreshRole();
  }, []);

  const handleLogOut = () => {
    logout();
    history.push({pathname:'/page/Login'});
  };

  const handleSodIconClick = () => {
    history.push({ pathname: '/page/Home' });
    menuRef.current?.close();
  }

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
      title: 'Repair Shop',
      url: '/page/Repair',
      iosIcon: constructOutline,
      mdIcon: constructSharp
    },
    {
      title: 'Download',
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

  return (
    <>
      <IonMenu contentId="main" type="overlay" ref={menuRef}>
        <IonContent>
          {role &&
            <IonList id="inbox-list">
              <IonImg src="assets/images/sod.png" className='menu-logo' alt="Song of the day!"
                onClick={() => handleSodIconClick()}>
              </IonImg>
              <IonListHeader>Song of the Day</IonListHeader>
              <IonNote>All the music that is fit to be played!</IonNote>
              {appPages.map((appPage, index) => {
                if((appPage.title === 'My Bullpen' || appPage.title === 'Repair Shop')
                      && role !== 'ADMIN' && role !== 'SUBMITTER') {
                  return false;
                }
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
          }
        </IonContent>
      </IonMenu>
    </>
  );
};

export default Menu;
