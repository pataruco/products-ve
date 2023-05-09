import { MapContainer, TileLayer } from 'react-leaflet';

import { useStoresQuery } from '../api/operations.generated';
import { CustomMarker } from '../components/custom-marker';

const londonCoordinates = {
  lat: 51.50722,
  lng: -0.1275,
};

const MapComponent = () => {
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

  const markers = data?.stores?.map((store) => {
    if (store) {
      const { id, coordinates } = store;
      return <CustomMarker key={id} id={id} coordinates={coordinates} />;
    }
  });

  return (
    <MapContainer
      center={[londonCoordinates.lat, londonCoordinates.lng]}
      zoom={13}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {markers ? [...markers] : null}
    </MapContainer>
  );
};

export default MapComponent;
