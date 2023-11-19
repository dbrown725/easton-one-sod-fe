import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonMenuButton, IonModal, IonPage, IonRadio, IonRadioGroup, IonTitle, IonToggle, IonToolbar, ToggleChangeEventDetail, useIonAlert } from '@ionic/react';
import './Profile.css';
import {
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
import FabToSubmit from '../components/FabToSubmit';
import { useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_USER_INFO, UPDATE_DARK_MODE_ON, UPDATE_EMAIL_PREFERENCE, UPDATE_PRIVACY_ON } from '../graphql/graphql';
import { UserInfo } from '../common/types';
import ErrorDisplay from '../components/ErrorDisplay';
import { refreshRole, role } from '../firebase';
import { informationCircleOutline } from 'ionicons/icons';
import type { ToggleCustomEvent } from '@ionic/react';

const Profile: React.FC = () => {

  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [emailPreference, setEmailPreference] = useState<string>("all");
  const [presentAlert] = useIonAlert();
  const [privacyOn, setPrivacyOn] = useState<boolean>(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [darkModeOn, setDarkModeOn] = useState<boolean>(false);

  // Listen for the toggle check/uncheck to toggle the dark theme
  const toggleDarkModeInputChange = (ev: ToggleCustomEvent) => {
    updateDarkModeOn({ variables: { darkModeOn: !darkModeOn } });
  };

  const togglePrivacyInputChange = (e: CustomEvent<ToggleChangeEventDetail>) => {
    updatePrivacyOn({ variables: { privacyOn: !privacyOn } });
  };

  // Add or remove the "dark" class on the document body
  const toggleDarkTheme = (shouldAdd: boolean) => {
    document.body.classList.toggle('dark', shouldAdd);
  };

  const [
    getUserInfo,
    { loading, error, data }
  ] = useLazyQuery(GET_USER_INFO, {
    fetchPolicy: 'no-cache', nextFetchPolicy: 'no-cache', onCompleted: (data) => {
      setUserInfo(data.getUserInfo);
      setEmailPreference(data.getUserInfo.emailPreference);
      setPrivacyOn(data.getUserInfo.privacyOn);
      setDarkModeOn(data.getUserInfo.darkModeOn);
      toggleDarkTheme(data.getUserInfo.darkModeOn);
    }
  });

  const [updateEmailPreference, { data: updtData, loading: updtLoading, error: updtError }] = useMutation(UPDATE_EMAIL_PREFERENCE, {
    onCompleted: (data) => {
      getUserInfo();
      showEmailPrefUpdatedAlert();
    }
  });

  const [updatePrivacyOn, { data: updtPriData, loading: updtPriLoading, error: updtPriError }] = useMutation(UPDATE_PRIVACY_ON, {
    onCompleted: (data) => {
      getUserInfo();
      showPrivacyUpdatedAlert();
    }
  });

  const [updateDarkModeOn, { data: updtDarkData, loading: updtDarkLoading, error: updtDarkError }] = useMutation(UPDATE_DARK_MODE_ON, {
    onCompleted: (data) => {
      getUserInfo();
      showDarkModeUpdatedAlert();
    }
  });

  const resetEmailPreference = () => {
    setEmailPreference(userInfo?.emailPreference as string);
  };

  const handleEmailPrefUpdate = () => {
    updateEmailPreference({ variables: { emailPreference: emailPreference } });
  };

  useEffect(() => {
    getUserInfo();
    refreshRole();
  }, []);

  const showEmailPrefUpdatedAlert = () => {
    presentAlert({
      header: 'Your Email Preference change is complete.',
      buttons: [
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
          },
        },
      ]
    });
  };

  const showPrivacyUpdatedAlert = () => {
    presentAlert({
      header: 'Your Privacy mode change is complete.',
      buttons: [
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
          },
        },
      ]
    });
  };

  const showDarkModeUpdatedAlert = () => {
    presentAlert({
      header: 'Your Dark mode change is complete.',
      buttons: [
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
          },
        },
      ]
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>My Profile</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">My Profile</IonTitle>
          </IonToolbar>
        </IonHeader>
        {
          error != null ? <ErrorDisplay message={error.message} detail={error.stack} /> :
            userInfo &&
            <>
              <IonGrid className='profile-ion-grid'>
                <IonRow className='profile-top-row'>
                  <IonCol size='4' size-md='2'>
                    <img alt={userInfo?.firstName + " " + userInfo?.lastName}
                      src={"https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=" + userInfo?.firstName + "+" + userInfo?.lastName + "&rounded=true&background=" + userInfo?.avatarColor}
                      title={userInfo?.firstName + " " + userInfo?.lastName} />
                  </IonCol>
                  <IonCol size='8' size-md='10'>
                  </IonCol>
                </IonRow>
                <IonRow className='profile-second-row'>
                  <IonCol size='4' size-md='2'>
                    Screen Name:
                  </IonCol>
                  <IonCol size='8' size-md='10'>
                    {userInfo?.screenName}
                  </IonCol>
                </IonRow>

                <IonRow>
                  <IonCol size='4' size-md='2'>
                    First Name:
                  </IonCol>
                  <IonCol size='8' size-md='10'>
                    {userInfo?.firstName}
                  </IonCol>
                </IonRow>

                <IonRow>
                  <IonCol size='4' size-md='2'>
                    Last Name:
                  </IonCol>
                  <IonCol size='8' size-md='10'>
                    {userInfo?.lastName}
                  </IonCol>
                </IonRow>

                <IonRow>
                  <IonCol size='4' size-md='2'>
                    Email:
                  </IonCol>
                  <IonCol size='8' size-md='10'>
                    {userInfo?.email}
                  </IonCol>
                </IonRow>

                <IonRow>
                  <IonCol size='4' size-md='2'>
                    Email Verified:
                  </IonCol>
                  <IonCol size='8' size-md='10'>
                    {userInfo?.isEmailVerified ? 'True' : 'False'}
                  </IonCol>
                </IonRow>

                <IonRow>
                  <IonCol size='4' size-md='2'>
                    Role:
                  </IonCol>
                  <IonCol size='8' size-md='10'>
                    {role}
                  </IonCol>
                </IonRow>
              </IonGrid>
              {role !== 'GUEST' &&
                <>
                  <br />
                  <h2 className='profile-ion-email-preference-title'>Email preferences</h2>
                  <IonRadioGroup value={emailPreference} onIonChange={({ detail: { value } }) => setEmailPreference(value)}>
                    <IonRadio className='profile-ion-radio' value="ALL" labelPlacement="end">
                      <div className="profile-radio-text">Receive emails for new songs and comments.</div>
                    </IonRadio>
                    <br />
                    <IonRadio className='profile-ion-radio' value="NEW_SONG_ONLY" labelPlacement="end">
                      Receive emails for new songs only.
                    </IonRadio>
                    <br />
                    <IonRadio className='profile-ion-radio' value="NONE" labelPlacement="end">
                      Receive no emails.
                    </IonRadio>
                  </IonRadioGroup>

                  <div className='profile-buttons'>
                    <IonButton id="resetEmailPreferences" size="small" type="submit" className="profile-button ion-margin-top" onClick={(e) => resetEmailPreference()}>
                      Reset
                    </IonButton>
                    <IonButton id="updateEmailPreferences" size="small" type="submit" className="profile-button" onClick={(e) => handleEmailPrefUpdate()}>
                      Update Email Preferences
                    </IonButton>
                  </div>

                  <span className='profile-ion-privacy-on-title'>Set privacy mode</span>
                  <span className="profile-privacy-on-info-icon-span" title="Privacy On Info"
                    onClick={(event) => setIsInfoOpen(true)}>
                    <IonIcon className="profile-privacy-on-info-icon" icon={informationCircleOutline} size="large" color="primary"></IonIcon>
                  </span>
                  <IonItem className="profile-privacy-on-toggle">
                    <IonLabel>Privacy mode</IonLabel>
                    <IonToggle aria-label="archive toggle" slot="end" checked={privacyOn} onIonChange={e => { togglePrivacyInputChange(e) }}></IonToggle>
                  </IonItem>
                  {role === 'ADMIN' &&
                    <>
                    <span className='profile-ion-privacy-on-title'>Set dark mode</span>
                    <IonItem className="profile-privacy-on-toggle">
                      <IonLabel>Dark mode</IonLabel>
                      <IonToggle aria-label="archive toggle" slot="end" checked={darkModeOn} onIonChange={e => { toggleDarkModeInputChange(e) }}></IonToggle>
                    </IonItem>
                    </>
                  }
                </>
              }
            </>
        }
        <FabToSubmit />
        <IonModal className='profile-info-modal' backdropDismiss={false} isOpen={isInfoOpen}>
          <>
            <IonHeader>
              <IonToolbar>
                <IonTitle className="toolbar-title">Privacy option information</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={() => setIsInfoOpen(false)}>Close</IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent>
              <div className="profile-info-modal-content">
                <div>A GUEST user can view all Song of the Day content but:</div>
                <div>* does not have a Bullpen.</div>
                <div>* can't submit songs.</div>
                <div>* does not receive emails.</div>
                <div>* is anonymous to other users.</div>
                <div className="profile-info-modal-content-spacing">The number of GUEST users over time will grow as people ask for friends and family to be added.</div>
                <div className="profile-info-modal-content-spacing">To protect the identity of current SOD submitters the "Privacy Option" has been added.</div>
                <div className="profile-info-modal-content-spacing">If you activate the "Privacy Option" your identity will appear obfuscated to GUEST users.</div>
                <div className="profile-info-modal-content-spacing">For example if David Brown turns privacy on then he will appear to GUEST users as "User 8" and his avatar will have the initials "U8".</div>
              </div>
            </IonContent>
          </>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
