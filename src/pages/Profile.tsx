import { IonButton, IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonRadio, IonRadioGroup, IonTitle, IonToolbar, useIonAlert } from '@ionic/react';
import './Profile.css';
import {
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
import FabToSubmit from '../components/FabToSubmit';
import { useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_USER_INFO, UPDATE_EMAIL_PREFERENCE } from '../graphql/graphql';
import { UserInfo } from '../common/types';
import ErrorDisplay from '../components/ErrorDisplay';
import { refreshRole, role } from '../firebase';

const Profile: React.FC = () => {

  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [emailPreference, setEmailPreference] = useState<string>("all");
  const [presentAlert] = useIonAlert();

  const [
    getUserInfo,
    { loading, error, data }
  ] = useLazyQuery(GET_USER_INFO, {
    fetchPolicy: 'no-cache', nextFetchPolicy: 'no-cache', onCompleted: (data) => {
      setUserInfo(data.getUserInfo);
      setEmailPreference(data.getUserInfo.emailPreference);
    }
  });

  const [updateEmailPreference, { data: updtData, loading: updtLoading, error: updtError }] = useMutation(UPDATE_EMAIL_PREFERENCE, {
    onCompleted: (data) => {
      getUserInfo();
      showEmailPrefUpdatedAlert();
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
              <br />
              <h2 className='profile-ion-title'>Email preferences</h2>
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
            </>
        }
        <FabToSubmit />
      </IonContent>
    </IonPage>
  );
};

export default Profile;
