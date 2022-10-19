import { IonCard, IonCardContent, IonCol, IonGrid, IonLabel, IonRow } from '@ionic/react';
import {Song} from '../common/types';
import {SongResult} from '../common/types';

const SongList: React.FC<SongResult> = (songResult) => {

  return (  
        <div>
            {songResult &&
              songResult.songs.map((song: Song) => {
            return (
              <IonCard id={song.id.toString()} key={song.id} class="card-center">
                <IonCardContent className="puzzle-content">
                  <IonGrid>
                    <IonRow>
                      <IonCol>
                        <IonRow>
                          <IonCol>
                            <IonLabel position="floating">
                              Score
                            </IonLabel>
                            <h3>{song.score}</h3>
                          </IonCol>

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