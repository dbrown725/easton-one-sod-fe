import { IonAlert, IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Submit.css';
import { Song } from '../common/types';
import SongForm from '../components/SongForm';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router';
import { useEffect, useState } from 'react';
import FabToSubmit from '../components/FabToSubmit';
import { ADD_BULLPEN_SONG, INSERT_SOD } from '../graphql/graphql';

const Submit: React.FC = () => {

  const song: Song = {
    bandName: '',
    songName: '',
    title: '',
    link: '',
    message: '',
    playlist: ''
  };

  const history = useHistory();

  const [showBpAlert, setShowBpAlert] = useState<boolean>(false);

  const [showAlert, setShowAlert] = useState<boolean>(false);

  const [addBpSong, { data: bpData, loading: bpLoading, error: bpError }] = useMutation(ADD_BULLPEN_SONG);

  const [insertSod, { data, loading, error }] = useMutation(INSERT_SOD);

  //bpLoading && console.log("....bpLoading");
  bpError && console.log("error: ", bpError);
  //bpData && console.log("data: ", bpData);

  //loading && console.log("....loading");
  error && console.log("error: ", error);
  //data && console.log("data: ", data);

  const handleBpFormSubmit = () => {
    //Hard coded for now, in the future will use the authenticated person's user object
    song.userId = 1;
    addBpSong({ variables: { title: song.title, songName: song.songName, bandName: song.bandName, link: song.link, message: song.message, userId: song.userId } });
  };

  const handleSODFormSubmit = () => {
    //Hard coded for now, in the future will use the authenticated person's user object
    song.userId = 1;
    insertSod({ variables: { title: song.title, songName: song.songName, bandName: song.bandName, link: song.link, message: song.message, playlist: song.playlist, userId: song.userId } });
    
  };

  useEffect(() => {
    data && setShowAlert(true);
  }, [data]);

  useEffect(() => {
    bpData && setShowBpAlert(true);
  }, [bpData]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Submit a song</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Submit</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonAlert
            isOpen={showBpAlert}
            onDidDismiss={() => {setShowBpAlert(false); history.push({pathname:'/page/Bullpen'})}}
            header=""
            subHeader="Congrats!"
            message="Your save to Bullpen is complete."
            buttons={['OK']}
          />
          <IonAlert
            isOpen={showAlert}
            onDidDismiss={() => {setShowAlert(false); history.push({pathname:'/page/Latest'})}}
            header=""
            subHeader="Congrats!"
            message="Your Song submission is complete."
            buttons={['OK']}
          />
          <SongForm bpCallback={handleBpFormSubmit} sodCallback={handleSODFormSubmit} song={song}></SongForm>
          <FabToSubmit/>
        </>
      </IonContent>
    </IonPage>
  );
};

export default Submit;
