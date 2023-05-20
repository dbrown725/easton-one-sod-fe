import { IonList, IonReorderGroup } from '@ionic/react';
import { SongWrapper } from '../common/types';
import { SongListProps } from '../common/types';
import './SongList.css';
import { useEffect, useState } from 'react';
import { refreshRole } from '../firebase';
import { role } from '../firebase';
import SongListItemNotDesktop from './SongListItemNotDesktop';
import SongListDesktop from './SongListDesktop';

const SongList: React.FC<SongListProps> = (props) => {

  const [screenWidth, setScreenWidth] = useState<number>(0);

  const [desktopSize, isDesktopSize] = useState<boolean>(false);

  const [songWrapperList, setSongWrapperList] = useState<SongWrapper[]>([]);

  useEffect(() => {
    refreshRole();

    var win = window,
      doc = document,
      docElem = doc.documentElement,
      body = doc.getElementsByTagName('body')[0],
      x = win.innerWidth || docElem.clientWidth || body.clientWidth,
      y = win.innerHeight || docElem.clientHeight || body.clientHeight;
    setScreenWidth(x as number);
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
                <SongListDesktop songListProps={props} songWrapperList={songWrapperList}/>
            }
            {(screenWidth < 992 || props.showDeleteButton) &&
              songWrapperList.length > 0 &&
              songWrapperList.map((wrapper: SongWrapper) => {
                return (
                  <div key={wrapper.song.id}>
                    <SongListItemNotDesktop songListProps={props} songWrapper={wrapper}/>
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