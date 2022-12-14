import './Latest.css';
import { GET_MOST_RECENT_SONGS } from '../graphql/graphql';
import ScrollingSongList from '../components/ScrollingSongList';

const Latest: React.FC = () => {

  return (
    <ScrollingSongList count={400} addDataIncrement={20} queryDocumentNode={GET_MOST_RECENT_SONGS} queryDefinitionName={"getMostRecentSongs"} pageTitleText={"Latest Songs"} />
  );
};

export default Latest;
