import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

import { useStoresQuery } from '../api/operations.generated';

const Home = () => {
  const { data, error, loading } = useStoresQuery({
    variables: {
      from: {
        coordinates: {
          lat: 51.50722,
          lng: -0.1275,
        },
        distance: 10000,
      },
    },
  });

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error : {error.message}</p>;

  const markers = data?.stores?.map(
    ({ id, coordinates: { lat, lng }, name, address }) => {
      return (
        <Marker position={[lat, lng]} key={id}>
          <Popup>
            <p>{name}</p>
            <address>{address}</address>
          </Popup>
        </Marker>
      );
    },
  );

  return (
    <MapContainer
      // @ts-ignore bad TS import on react-leaflet
      center={[51.50722, -0.1275]}
      zoom={13}
      scrollWheelZoom={false}
    >
      <TileLayer
        // @ts-ignore bad TS import on react-leaflet
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {data?.stores?.map(({ id, coordinates: { lat, lng }, name, address }) => {
        return (
          <Marker position={[lat, lng]} key={id}>
            <Popup>
              <p>{name}</p>
              <address>{address}</address>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default Home;
