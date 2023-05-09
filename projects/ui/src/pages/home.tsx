import MapComponent from '../components/map';
import MapPopUp from '../components/map-pop-up';
import PageLayout from '../components/page-layout';

const Home = () => {
  return (
    <PageLayout>
      <MapComponent />
      <MapPopUp />
    </PageLayout>
  );
};

export default Home;
