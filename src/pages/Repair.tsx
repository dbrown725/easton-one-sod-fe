import './Repair.css';
import { GET_SONGS_WITH_ISSUES, GET_SONGS_WITH_ISSUES_COUNT } from '../graphql/graphql';
import ScrollingSongList from '../components/ScrollingSongList';
import { IonButtons, IonContent, IonHeader, IonLabel, IonMenuButton, IonPage, IonSegment, IonSegmentButton, IonTitle, IonToolbar, SegmentChangeEventDetail } from '@ionic/react';
import { useEffect, useState } from 'react';
import SearchForSongs from '../components/SearchForSongs';
import { Song } from '../common/types';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setIssueCount } from '../store/slices/issueCountSlice';
import { useLazyQuery } from '@apollo/client';

const Repair: React.FC = () => {

  const [isSearchShown, setSearchShown] = useState(false);
  const [isAndroid, setAndroid] = useState(false);
  const [segmentValue, setSegmentValue] = useState<string | undefined | null>('flagged');
  const history = useHistory();

  const [repairCount, setRepairCount] = useState<string>('0');
  const songsWithIssuesCount = useSelector((state: RootState) => state.issueCount.value);

  const dispatch = useDispatch();

  const [
    getIssueCount,
    { loading: loadingCount, error: errorCount, data: dataCount }
  ] = useLazyQuery(GET_SONGS_WITH_ISSUES_COUNT, {
    fetchPolicy: 'no-cache', nextFetchPolicy: 'no-cache', onCompleted: (data) => {
      setRepairCount(data.getSongsWithIssuesCount);
      dispatch(setIssueCount(data.getSongsWithIssuesCount));
    },
  });

  useEffect(() => {
    if(window?.navigator?.userAgent.includes("Android")) {
      setAndroid(true);
    }
    getIssueCount();
  }, []);

  useEffect(() => {
    setRepairCount(songsWithIssuesCount.toString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [songsWithIssuesCount]);

  const handleInputChangeSegment = (e: CustomEvent<SegmentChangeEventDetail>) => {
    setSegmentValue(e.detail.value);
    if (e.detail.value === 'search') {
      setSearchShown(true);
    }
    if (e.detail.value === 'flagged') {
      setSearchShown(false);
    }
  };

  const editClickHandler = (event: React.MouseEvent<HTMLSpanElement>, song: Song) => {
    history.push({
      pathname:'/page/Submit',
      state: {song: song, updateSODRequest: true}
    })
  }

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
        <IonSegment value={segmentValue as string} onIonChange={e => { handleInputChangeSegment(e) }}>
            <IonSegmentButton value="flagged">
              <IonLabel style={{fontSize: isAndroid ? '12px' : '14px' }}>{repairCount} Flagged Songs</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="search">
              <IonLabel style={{fontSize: isAndroid ? '12px' : '14px' }}>Search for any Song</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        {!isSearchShown &&
          <ScrollingSongList
              count={700}
              addDataIncrement={40}
              editCallback={editClickHandler}
              queryDocumentNode={GET_SONGS_WITH_ISSUES}
              queryDefinitionName={"getSongsWithIssues"}
              showDeleteButton={false}
              showEditButton={true} />}
        {isSearchShown && <SearchForSongs editCallback={editClickHandler} showEditButton={true}/>}
      </IonContent>
    </IonPage>
  );
};

export default Repair;
