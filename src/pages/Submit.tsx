import { IonAlert, IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Submit.css';
import { Song } from '../common/types';
import SongForm from '../components/SongForm';
import { gql, useMutation } from '@apollo/client';
import { useHistory } from 'react-router';
import { useEffect, useState } from 'react';

const Submit: React.FC = () => {

  const song: Song = {
    bandName: '',
    songName: '',
    title: '',
    link: '',
    message: '',
    playlist: ''
  };

  const INSERT_SOD = gql`
  mutation insertSodSong($title: String!, $songName: String!, $bandName: String!, $link: String!, $message: String!, $playlist: String!, $userId: ID!) {
    insertSodSong(
      title: $title
      songName: $songName
      bandName: $bandName
      link: $link
      message: $message
      playlist: $playlist
      userId: $userId) 
      {
      title
      songName
      bandName
      link
      message
      playlist
      userId
    }
  }
`;

  const history = useHistory();

  const [showAlert, setShowAlert] = useState<boolean>(false);

  const [insertSod, { data, loading, error }] = useMutation(INSERT_SOD);

  //loading && console.log("....loading");
  error && console.log("error: ", error);
  data && console.log("data: ", data);

  const handleFormSubmit = () => {
    console.log('in handleFormSubmit song:', song);

    //Hard coded for now, in the future will use the authenticated person's user object
    song.userId = 1;

    insertSod({ variables: { title: song.title, songName: song.songName, bandName: song.bandName, link: song.link, message: song.message, playlist: song.playlist, userId: song.userId } });
    
  };

  useEffect(() => {
    data && setShowAlert(true);
  }, [data]);

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
            isOpen={showAlert}
            onDidDismiss={() => {setShowAlert(false); history.push('/page/Latest')}}
            header=""
            subHeader="Congrats!"
            message="Your Song submission is complete."
            buttons={['OK']}
          />
          <SongForm Callback={handleFormSubmit} song={song}></SongForm>
        </>
      </IonContent>
    </IonPage>
  );
};

export default Submit;
