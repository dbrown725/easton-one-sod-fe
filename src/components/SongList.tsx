import { IonCard, IonCardContent, IonCol, IonGrid, IonLabel, IonRow } from '@ionic/react';
import {Song} from '../common/types';
import {SongResult} from '../common/types';
import {SongListProps} from '../common/types';

const SongList: React.FC<SongListProps> = (props) => {

  return (  
        <div>
            {props.songs &&
              props.songs.map((song: Song) => {
            return (
              <IonCard id={song.id.toString()} key={song.id} class="card-center">
                <IonCardContent className="puzzle-content">
                  <IonGrid>
                    <IonRow>
                      <IonCol>
                        <IonRow>
                            {
                              props.showId &&
                                <>
                                  <IonCol>
                                  <IonLabel position="floating">
                                  Id
                                  </IonLabel>
                                  <h3>{song.id}</h3>
                                  </IonCol>
                                </>
                            }
                          
                            {
                              props.showScore &&
                                <>
                                  <IonCol>
                                  <IonLabel position="floating">
                                  Score
                                  </IonLabel>
                                  <h3>{song.score}</h3>
                                  </IonCol>
                                </>
                            }

                          <IonCol>
                            <IonLabel position="floating">
                              Title
                            </IonLabel>
                            <h3><a href={song.link} target='_blank' rel="noreferrer">{song.title}</a></h3>
                          </IonCol>
                        </IonRow>

                        <IonRow>
                          <IonCol>
                            <IonLabel position="floating">
                              Band name
                            </IonLabel>
                            <h3>{song.bandName}</h3>
                          </IonCol>

                          <IonCol>
                            <IonLabel position="floating">
                              Song name
                            </IonLabel>
                            <h3>{song.songName}</h3>
                          </IonCol>
                        </IonRow>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonCardContent>
              </IonCard>    
                );
            })}
        </div>
    );
}
 
export default SongList;