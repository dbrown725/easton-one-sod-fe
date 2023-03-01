import { IonButtons, IonContent, IonHeader, IonImg, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Profile.css';
import dorm from './../assets/images/Dorm.jpg';
import {
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
import FabToSubmit from '../components/FabToSubmit';
import { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_USER_INFO } from '../graphql/graphql';
import { UserInfo } from '../common/types';


const Profile: React.FC = () => {

  const [userInfo, setUserInfo] = useState<UserInfo>();

  const [
    getUserInfo,
    { loading: countLoading, error: countError, data: countData }
  ] = useLazyQuery(GET_USER_INFO, {
    fetchPolicy: 'no-cache', nextFetchPolicy: 'no-cache', onCompleted: (data) => {
      console.log('userInfo: ' , data.getUserInfo);
      setUserInfo(data.getUserInfo);
    }
  });

  useEffect(() => {
    getUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

          <IonGrid>
            <IonRow class="top-row">
              <IonCol size='4' size-md='2'>
                <img alt={userInfo?.firstName + " " + userInfo?.lastName}
                                    src={"https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=" + userInfo?.firstName + "+" + userInfo?.lastName + "&rounded=true&background=" + userInfo?.avatarColor}
                                    title={userInfo?.firstName + " " + userInfo?.lastName}/>
              </IonCol>
              <IonCol size='8' size-md='10'>
              </IonCol>
            </IonRow>
            <IonRow class='second-row'>
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
                {userInfo?.isEmailVerified? 'True':'False'}
              </IonCol>
            </IonRow>
          </IonGrid>
          <FabToSubmit/>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
