import { MapContainer, TileLayer } from 'react-leaflet';

import { useStoresQuery } from '../api/operations.generated';
import { CustomMarker } from '../components/custom-marker';

const londonCoordinates = {
  lat: 51.50722,
  lng: -0.1275,
};

const Home = () => {
  const { data, error, loading } = useStoresQuery({
    variables: {
      from: {
        coordinates: {
          lat: londonCoordinates.lat,
          lng: londonCoordinates.lng,
        },
        distance: 10000,
      },
    },
  });

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error : {error.message}</p>;

  const markers = data?.stores?.map(({ id, coordinates, name, address }) => (
    <CustomMarker
      id={id}
      coordinates={coordinates}
      name={name}
      address={address}
    />
  ));

  return (
    <MapContainer
      // @ts-ignore bad TS import on react-leaflet
      center={[londonCoordinates.lat, londonCoordinates.lng]}
      zoom={13}
      scrollWheelZoom={false}
    >
      <TileLayer
        // @ts-ignore bad TS import on react-leaflet
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        url="https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}@2x.png?key=Afwd8yuPeMViLnCdQzLO"
      />

      {markers ? [...markers] : null}
    </MapContainer>
  );
};

export default Home;
