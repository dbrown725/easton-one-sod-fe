import { IonFab, IonFabButton, IonIcon } from '@ionic/react';
import { add } from 'ionicons/icons';
import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { role, refreshRole } from '../firebase';

const FabToSubmit: React.FC = () => {

  const history = useHistory();
  useEffect(() => {
    refreshRole();
  }, []);

  const handleFabClick = () => {
    history.push({
      pathname: '/page/Submit',
      state: { updateSODRequest: false }
    });
  }

  return (
    <>
      {
        (role === 'ADMIN' || role === 'SUBMITTER') &&
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={ () => handleFabClick()}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      }
    </>
  );
}
 
export default FabToSubmit;