import { IonAvatar, IonCol, IonGrid, IonIcon, IonImg, IonItem, IonLabel, IonRow } from '@ionic/react';
import { SongListDesktopProps, SongWrapper } from '../common/types';
import { chatbubble, chatbubbleEllipses, chatbubbleEllipsesOutline, chatbubbleOutline, create } from 'ionicons/icons';
import './SongListDesktop.css';
import { getThumbnailLink, highlightMatches, sanitizeData } from '../common/helper';
import { useEffect, useState } from 'react';
import { role, refreshRole } from '../firebase';
import CommentModal from './CommentModal';

const SongListDesktop: React.FC<SongListDesktopProps> = (props) => {

  const [titleColumSize, setTitleColumnSize] = useState<string>("2.5");
  const [commentSongId, setCommentSongId] = useState<number>(0);

  useEffect(() => {
    refreshRole();
    if(!props.songListProps.showEditButton) {
      setTitleColumnSize("3.5");
    }
  }, []);

  return (
    <IonGrid className="desktop">
      {
        props.songWrapperList.map((wrapper: SongWrapper) => {
          return (
            <IonRow className="item-row" key={wrapper.song.id}>
              <IonCol size="7">
                <IonItem>
                  <a slot="start" href={wrapper.song.link} target='_blank' rel="noreferrer">
                    <IonImg src={getThumbnailLink(wrapper.song.link, "high")} className='thumbnail-image'/>
                   </a>
                  <IonLabel>
                    <h1 title={sanitizeData(wrapper.song.songName)}
                      dangerouslySetInnerHTML={{ __html: wrapper.song.songNameHighlighted ? highlightMatches(sanitizeData(wrapper.song.songNameHighlighted)) : sanitizeData(wrapper.song.songName) }}>
                    </h1>
                    <p dangerouslySetInnerHTML={{ __html: wrapper.song.bandNameHighlighted ? highlightMatches(sanitizeData(wrapper.song.bandNameHighlighted)) : sanitizeData(wrapper.song.bandName) }}></p>
                  </IonLabel>
                </IonItem>
              </IonCol>
              <IonCol size={titleColumSize}>
                <div className="title"
                    dangerouslySetInnerHTML={{ __html: wrapper.song.titleHighlighted ? highlightMatches(sanitizeData(wrapper.song.titleHighlighted)) : sanitizeData(wrapper.song.title) }}>
                </div>
              </IonCol>
              <IonCol size="1.5">
                <IonRow>
                  <IonCol className="avatar-column">
                    <IonAvatar>
                      <img
                        src={"https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=" + wrapper.song.userFirstName + "+" + wrapper.song.userLastName + "&rounded=true&background=" + wrapper.song.userAvatarColor}
                        title={wrapper.song.userFirstName + " " + wrapper.song.userLastName} />
                  </IonAvatar>
                  </IonCol>
                </IonRow>
                <IonRow> 
                  <IonCol>
                    <div className="date-div"
                      dangerouslySetInnerHTML={{ __html: sanitizeData(wrapper.song.createTime ? wrapper.song.createTime.substring(0, 10) : '') }}>
                    </div>
                  </IonCol>
                </IonRow>
              </IonCol>

                <IonCol size="1" className="edit-column">
                  {wrapper.displayEditButton &&
                    <span id="edit" title="Edit" onClick={(event) => props.songListProps.editCallback?.(event, wrapper.song)}>
                      <IonIcon icon={create} size="1" title="Edit"></IonIcon>
                    </span>
                  }
                  {role !== 'GUEST' &&
                    <>
                      <br/>
                      <span id="comment" title="Comment" onClick={(event) => setCommentSongId(wrapper.song.id as number)}>
                        <IonIcon icon={chatbubbleEllipsesOutline} size="1" title="Comment"></IonIcon>
                      </span>
                      {wrapper.song.songComments?.length! > 0 &&
                        <span>{wrapper.song.songComments?.length}</span>
                      }
                    </>
                  }
                </IonCol>
            </IonRow>
          );
        })
      }
      {commentSongId > 0 && <CommentModal songId={commentSongId} closeModalCallback={() => setCommentSongId(0)}/>}
    </IonGrid>
  );
}

export default SongListDesktop;