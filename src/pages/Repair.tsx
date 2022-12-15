import './Repair.css';
import { GET_SONGS_WITH_ISSUES } from '../graphql/graphql';
import ScrollingSongList from '../components/ScrollingSongList';
import { IonButtons, IonContent, IonHeader, IonLabel, IonMenuButton, IonPage, IonSegment, IonSegmentButton, IonTitle, IonToolbar, SegmentChangeEventDetail } from '@ionic/react';
import { useState } from 'react';
import SearchForSongs from '../components/SearchForSongs';

const Repair: React.FC = () => {

  const [isSearchShown, setSearchShown] = useState(false);
  const [segmentValue, setSegmentValue] = useState<string | undefined | null>('flagged');

  const handleInputChangeSegment = (e: CustomEvent<SegmentChangeEventDetail>) => {
    setSegmentValue(e.detail.value);
    if (e.detail.value === 'search') {
      setSearchShown(true);
    }
    if (e.detail.value === 'flagged') {
      setSearchShown(false);
    }
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Song Repair Shop</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Song Repair Shop</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonSegment value={segmentValue} onIonChange={e => { handleInputChangeSegment(e) }}>
            <IonSegmentButton value="flagged">
              <IonLabel>Flagged Songs</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="search">
              <IonLabel>Search for Songs</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        {!isSearchShown && <ScrollingSongList count={700} addDataIncrement={20} queryDocumentNode={GET_SONGS_WITH_ISSUES} queryDefinitionName={"getSongsWithIssues"} />}
        {isSearchShown && <SearchForSongs />}
      </IonContent>
    </IonPage>
  );
};

export default Repair;
