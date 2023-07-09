import { IonButtons, IonContent, IonHeader, IonImg, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Home.css';
import {
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
import FabToSubmit from '../components/FabToSubmit';
import { getScreenDimensions } from '../common/helper';
import { useEffect, useState } from 'react';
import CommentModal from '../components/CommentModal';

const Home: React.FC = () => {
  const [commentSongId, setCommentSongId] = useState<number>(0);

  var dimensions = getScreenDimensions().width + ' × ' + getScreenDimensions().height;

  useEffect(() => {
    const cmmtId = Number(localStorage.getItem('commentSongId'));
    if(cmmtId > 0) {
      setCommentSongId(cmmtId);
      localStorage.removeItem('commentSongId');
    } else {
      setCommentSongId(0);
    }
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>

        <IonGrid>
          <IonRow className='home-image-rows'>
            <IonCol size='3'>
              <IonImg src="assets/images/sod.png"></IonImg>
            </IonCol>
            <IonCol size='3'>
              <IonImg className='home-img-cropper' src="https://e-cdns-images.dzcdn.net/images/artist/895c65537c74c2014b459f73e84bccb0/500x500-000000-80-0-0.jpg"></IonImg>
            </IonCol>
            <IonCol size='3'>
              <IonImg className='home-img-cropper' src="https://e-cdns-images.dzcdn.net/images/artist/b0240b776c1cf0dc0abfd147cd2b5d49/500x500-000000-80-0-0.jpg"></IonImg>
            </IonCol>
            <IonCol size='3'>
              <IonImg className='home-img-cropper' src="https://e-cdns-images.dzcdn.net/images/artist/e096afc9c7a7f85200def0280e8971a3/500x500-000000-80-0-0.jpg"></IonImg>
            </IonCol>
          </IonRow>

          <IonRow className='home-image-rows'>
            <IonCol size='3'>
              <IonImg className='home-img-cropper' src="https://e-cdns-images.dzcdn.net/images/artist/12c02d423d0589f0e540a3b6f49221d5/500x500-000000-80-0-0.jpg"></IonImg>
            </IonCol>
            <IonCol size='3'>
              <IonImg className='home-img-cropper' src="https://e-cdns-images.dzcdn.net/images/artist/9bb4484b224cedeb0d79d0517ab2a4a4/500x500-000000-80-0-0.jpg"></IonImg>
            </IonCol>
            <IonCol size='3'>
              <IonImg className='home-img-cropper' src="https://e-cdns-images.dzcdn.net/images/artist/a095fc12d63101d25bfb0ec98eef783e/500x500-000000-80-0-0.jpg"></IonImg>
            </IonCol>
            <IonCol size='3'>
              <IonImg className='home-img-cropper' src="https://e-cdns-images.dzcdn.net/images/artist/805f2fedacc557abb956b72eb573cbb8/500x500-000000-80-0-0.jpg"></IonImg>
            </IonCol>
          </IonRow>

          <IonRow className='home-image-rows'>
            <IonCol size='3'>
              <IonImg className='home-img-cropper' src="https://e-cdns-images.dzcdn.net/images/artist/b6996bc45e793d05f9fffce17b97ad2c/500x500-000000-80-0-0.jpg"></IonImg>
            </IonCol>
            <IonCol size='3'>
              <IonImg className='home-img-cropper' src="https://e-cdns-images.dzcdn.net/images/artist/ba22e54b6a9b9696be627955a49c720a/500x500-000000-80-0-0.jpg"></IonImg>
            </IonCol>
            <IonCol size='3'>
              <IonImg className='home-img-cropper' src="https://e-cdns-images.dzcdn.net/images/artist/c4dc588c1a5e87253eace21204e25da7/500x500-000000-80-0-0.jpg"></IonImg>
            </IonCol>
            <IonCol size='3'>
              <IonImg className='home-img-cropper' src="https://e-cdns-images.dzcdn.net/images/artist/64d2b3ba8117b2a414f72130c49f40ca/500x500-000000-80-0-0.jpg"></IonImg>
            </IonCol>
          </IonRow>

          <IonRow className='home-image-rows'>
            <IonCol size='3'>
              <IonImg className='home-img-cropper' src="https://e-cdns-images.dzcdn.net/images/artist/566dc9dd5d0a8f4a834db3cf5d39a2fb/500x500-000000-80-0-0.jpg"></IonImg>
            </IonCol>
            <IonCol size='3'>
              <IonImg className='home-img-cropper' src="https://e-cdns-images.dzcdn.net/images/artist/10f47853f92da9107216a506ceeff055/500x500-000000-80-0-0.jpg"></IonImg>
            </IonCol>
            <IonCol size='3'>
              <IonImg className='home-img-cropper' src="https://e-cdns-images.dzcdn.net/images/artist/cb244e962064bbc2bbb25fb0568b28f7/500x500-000000-80-0-0.jpg"></IonImg>
            </IonCol>
            <IonCol size='3'>
              <IonImg className='home-img-cropper' src="https://e-cdns-images.dzcdn.net/images/artist/2ceac184bc846327f60c5b0d4247cc7a/500x500-000000-80-0-0.jpg"></IonImg>
            </IonCol>
          </IonRow>

          <IonRow className='home-image-rows'>
            <IonCol size='3'>
              <IonImg className='home-img-cropper' src="https://e-cdns-images.dzcdn.net/images/artist/4f172683209890085533af4668166ab9/500x500-000000-80-0-0.jpg"></IonImg>
            </IonCol>
            <IonCol size='3'>
              <IonImg className='home-img-cropper' src="https://e-cdns-images.dzcdn.net/images/artist/abb38a8ec624344816b92e24070a4f1c/500x500-000000-80-0-0.jpg"></IonImg>
            </IonCol>
            <IonCol size='3'>
              <IonImg className='home-img-cropper' src="https://e-cdns-images.dzcdn.net/images/artist/a1d999187aa7d9a1bdc17825aa844284/500x500-000000-80-0-0.jpg"></IonImg>
            </IonCol>
            <IonCol size='3'>
              <IonImg className='home-img-cropper' src="https://e-cdns-images.dzcdn.net/images/artist/b70e19feb83c794c394db4a14283ffe6/500x500-000000-80-0-0.jpg"></IonImg>
            </IonCol>
          </IonRow>

          <IonRow className='home-image-rows'>
            <IonCol size='3'>
              <IonImg className='home-img-cropper' src="https://e-cdns-images.dzcdn.net/images/artist/9ebfae8d20deb0fcc9ae8a4c180993f9/500x500-000000-80-0-0.jpg"></IonImg>
            </IonCol>
            <IonCol size='3'>
              <IonImg className='home-img-cropper' src="https://e-cdns-images.dzcdn.net/images/artist/9559c82a93a19f1fcbdb27f5f0dd5eff/500x500-000000-80-0-0.jpg"></IonImg>
            </IonCol>
            <IonCol size='3'>
              <IonImg className='home-img-cropper' src="https://e-cdns-images.dzcdn.net/images/artist/2deec542fc75d5691434c407ee077ff7/500x500-000000-80-0-0.jpg"></IonImg>
            </IonCol>
            <IonCol size='3'>
              <IonImg className='home-img-cropper' src="https://e-cdns-images.dzcdn.net/images/artist/340809d8bdd3341a65d6c658003e86ef/500x500-000000-80-0-0.jpg"></IonImg>
            </IonCol>
          </IonRow>
        </IonGrid>
        {commentSongId > 0 && <CommentModal songId={commentSongId}/>}
        <FabToSubmit />
      </IonContent>
    </IonPage>
  );
};

export default Home;
