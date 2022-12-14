import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useLazyQuery } from '@apollo/client';
import './ScrollingSongList.css';
import {ScrollingSongListProps, Song} from '../common/types';
import SongList from './SongList';
import { useEffect, useState } from 'react';
import { refresh } from 'ionicons/icons';
import { useHistory, useLocation } from 'react-router';
import FabToSubmit from './FabToSubmit';
// import { GET_SONGS_WITH_ISSUES } from '../graphql/graphql';

const ScrollingSongList: React.FC<ScrollingSongListProps> = (props) => {

  const history = useHistory();
  const location = useLocation();

  const [displayData, setDisplayData] = useState<Song[]>([]);
  const [dataBuckets, setDataBuckets] = useState<Song[][] | undefined | void>([]);
  const [currentBucketNumber, setCurrentBucketNumber] = useState<number>(0);
  const [isInfiniteDisabled, setInfiniteDisabled] = useState(false);

  // number of songs to return from backend
  let count: number = props.count;
  //  pagination size for infinit scroll
  let addDataIncrement: number = props.addDataIncrement;

  const [
    getSongs,
    { loading, error, data }
  ] = useLazyQuery(props.queryDocumentNode, {fetchPolicy: 'no-cache', nextFetchPolicy: 'no-cache',
    variables: { count: count }, onCompleted: (data) => {

      //Initialize again in case of a button click refresh
      setDisplayData([]);
      setCurrentBucketNumber(0);

      let bucketCount: number = Math.ceil(data?.[props.queryDefinitionName].length / addDataIncrement);

      //if only one bucket no need for infinite scroll
      if(bucketCount === 1) {
        setInfiniteDisabled(true);
      }

      let buckets: Song[][] = [];
      for (let i = 0; i < bucketCount; i++) {
          let songs: Song[] = [];
          fillBucket(data, songs, i + 1);
          buckets.push(songs);
      }
      // setting buckets for infinit scroll pagination
      setDataBuckets(buckets);
    },
  });

  const fillBucket =(data: any, songs: Song[], bucketNumber: number) => {
    let min: number = addDataIncrement * (bucketNumber - 1);
    let max: number = addDataIncrement * bucketNumber;
    for (let i = min; i < max; i++) {      
      if(typeof data?.[props.queryDefinitionName][i] !== 'undefined') {
        songs.push(data?.[props.queryDefinitionName]![i]);
      } else {
        break;
      }
    }
  }
 
  // Retrieve data upon initial page load and create a revisit page listener to reload data.
  useEffect(() => {
    getSongs();

    //Add listener: When page visited again reload songs
    const unlisten = history.listen(() => {
      if(history.location.pathname === location.pathname) {
        getSongs();
      }
    });
    return () => {
      // unlisten() will be called when the component unmounts, prevents memory leaks.
      unlisten();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //When databuckets loaded push data to display state object
  useEffect(() => {
    pushData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataBuckets]);

  const pushData = () => {
    if(dataBuckets!.length !== 0) {
      const newData: Song[] = [];
      let currentBucket: Song[] = dataBuckets![currentBucketNumber];
      for (let i = 0; i < currentBucket.length; i++) {
        newData.push(currentBucket[i]);
      }
      
      setDisplayData([
        ...displayData,
        ...newData
      ]);

      setCurrentBucketNumber(currentBucketNumber + 1);
    }
  }
  
  //called when page scrolled to bottom of current data list
  const loadData = (ev: any) => {
    setTimeout(() => {
      pushData();
      ev.target.complete();
      if (currentBucketNumber === dataBuckets!.length - 1) {
        setInfiniteDisabled(true);
      }
    }, 500);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{props.pageTitleText}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">{props.pageTitleText}</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonButton size="small" onClick={ () => getSongs()}> 
                <IonIcon slot="icon-only" icon={refresh}></IonIcon>
          </IonButton>
          {
            displayData
            && <SongList showId={true} showScore={false} songs={displayData} />
          }
          <IonInfiniteScroll
            onIonInfinite={loadData}
            threshold="100px"
            disabled={isInfiniteDisabled}
          >
            <IonInfiniteScrollContent
              loadingSpinner="bubbles"
              loadingText="Loading more data..."
            ></IonInfiniteScrollContent>
          </IonInfiniteScroll>
          <FabToSubmit/>
        </>
      </IonContent>
    </IonPage>
  );
};

export default ScrollingSongList;
