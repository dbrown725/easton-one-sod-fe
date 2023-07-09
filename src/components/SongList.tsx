import { IonList, IonReorderGroup } from '@ionic/react';
import { SongWrapper } from '../common/types';
import { SongListProps } from '../common/types';
import './SongList.css';
import { useEffect, useState } from 'react';
import { refreshRole } from '../firebase';
import { role } from '../firebase';
import SongListDesktop from './SongListDesktop';
import SongListCardItem from './SongListCardItem';
import { getScreenDimensions } from '../common/helper';

const SongList: React.FC<SongListProps> = (props) => {

  const [screenWidth, setScreenWidth] = useState<number>(0);

  const [songWrapperList, setSongWrapperList] = useState<SongWrapper[]>([]);

  useEffect(() => {
    refreshRole();
    setScreenWidth(getScreenDimensions().width);
  }, []);

  useEffect(() => {
    var wrapperList: SongWrapper[] = [];
    props.songs.forEach((song) => {
      var showEditButton = props.showEditButton && (role === 'ADMIN' || song.userIsTheSubmitter == true);
      var songWrapper: SongWrapper = {
        song: song,
        displayEditButton: showEditButton
      };
      wrapperList.push(songWrapper);
    });
    setSongWrapperList(wrapperList);
  }, [props.songs]);

  return (
    <div>
      <IonList>
        <IonReorderGroup disabled={typeof props.handleReorder === "undefined"} onIonItemReorder={props.handleReorder}>
            {screenWidth >= 992 && !props.showDeleteButton &&
              songWrapperList.length > 0 &&
                <SongListDesktop songListProps={props} songWrapperList={songWrapperList} closeModalCallback={props.closeModalCallback}/>
            }
            {(screenWidth < 992 || props.showDeleteButton) &&
              songWrapperList.length > 0 &&
              songWrapperList.map((wrapper: SongWrapper) => {
                return (
                  <div key={wrapper.song.id}>
                    <SongListCardItem songListProps={props} songWrapper={wrapper} closeModalCallback={() =>props.closeModalCallback!()}/>
                  </div>
                );
              })
            }
        </IonReorderGroup>
      </IonList>
    </div>
  );
}

export default SongList;