import { useMutation, useQuery } from '@apollo/client';
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, ItemReorderEventDetail } from '@ionic/react';
import { BullpenSongData, Song } from '../common/types';
import SongList from '../components/SongList';
import './Bullpen.css';

import { useState } from 'react';
import FabToSubmit from '../components/FabToSubmit';
import { GET_ALL_BULLPEN_SONGS, UPDATE_BULLPEN_SONG } from '../graphql/graphql';

const Bullpen: React.FC = () => {

  interface SongVars {
    // year: number;
  }

const [updateBPSong, { data: updateData, loading: updateLoading , error: updateError }] = useMutation(UPDATE_BULLPEN_SONG);

//updateLoading && console.log("....updateLoading");
updateError && console.log("updateError: ", updateError);
//updateData && console.log("updateData: ", updateData);

  const [displayData, setDisplayData] = useState<Song[]>([]);

  function handleReorder(event: CustomEvent<ItemReorderEventDetail>) {
    // The `from` and `to` properties contain the index of the item
    // when the drag started and ended, respectively
    //console.log('Dragged from index', event.detail.from, 'to', event.detail.to);

    //deep copy
    let tempSongs = JSON.parse(JSON.stringify(displayData));

    // Resetting the order of state so it matches the DOM
    const draggedItem = tempSongs.splice(event.detail.from, 1)[0];  
    tempSongs.splice(event.detail.to, 0, draggedItem); 
    
    //Sort Order logic written in a way that only one song needs to be updated on the back end
    if(event.detail.to === 0) {
      //dragged to the top
      if(tempSongs.length === 1) {
        draggedItem.sortOrder = 10000;
      } else {
        const songBelow = tempSongs[1];
        draggedItem.sortOrder = songBelow.sortOrder! + 10000;
      }
    } else {
      if((event.detail.to + 1) === tempSongs.length) {
        //dragged to the bottom
        const songAbove = tempSongs[event.detail.to - 1];
        const newSortOrder = Math.ceil(songAbove.sortOrder! * .5);
        draggedItem.sortOrder = newSortOrder;
      } else {
        //sandwiched between two songs, need to calculate the halfway point between both song's sort orders.
        const songAbove = tempSongs[event.detail.to - 1];
        const songBelow = tempSongs[event.detail.to + 1];
        draggedItem.sortOrder = Math.ceil((songAbove.sortOrder! - songBelow.sortOrder!) * .5) + songBelow.sortOrder!;
      }
    }

    updateBPSong({ variables: { id: draggedItem.id, title: draggedItem.title, 
      songName: draggedItem.songName, bandName: draggedItem.bandName, 
      link: draggedItem.link, message: draggedItem.message, 
      sortOrder: draggedItem.sortOrder } });
                         
    setDisplayData(tempSongs);
    
    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. This method can also be called directly
    // by the reorder group
    event.detail.complete();

  }

  const { loading, error, data } = useQuery<BullpenSongData, SongVars>(GET_ALL_BULLPEN_SONGS, 
    {fetchPolicy: 'no-cache', nextFetchPolicy: 'no-cache', onCompleted: (data) => {
    setDisplayData(data.getAllBullpenSongs);
    },
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>My Bullpen</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">My Bullpen</IonTitle>
          </IonToolbar>
        </IonHeader>

        {loading && <h1>loading</h1>}
        {
          displayData
            && 
            <SongList showId={true} showScore={false} handleReorder={handleReorder} songs={displayData}/>
        }
        <FabToSubmit/>
      </IonContent>
    </IonPage>
  );
};

export default Bullpen;
