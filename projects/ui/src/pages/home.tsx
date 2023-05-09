import { useRecoilValue } from 'recoil';

import MapComponent from '../components/map';
import MapPopUp from '../components/map-pop-up';
import PageLayout from '../components/page-layout';
import markerPopUpAtom from '../recoil/marker-popup';

const Home = () => {
  const { isOpen } = useRecoilValue(markerPopUpAtom);

  return (
    <PageLayout>
      <MapComponent />
      {isOpen ? <MapPopUp /> : null}
    </PageLayout>
  );
};

export default Home;
