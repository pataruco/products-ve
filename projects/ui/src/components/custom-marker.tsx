import React from 'react';
import { Marker, Popup } from 'react-leaflet';

import type { Store } from '../api/types.generated';

// @ts-ignore
export const CustomMarker: React.FC<Store> = ({
  id,
  coordinates,
  name,
  address,
}) => {
  if (coordinates) {
    const { lat, lng } = coordinates;

    if (lat && lng) {
      return (
        <Marker position={[lat, lng]} key={id}>
          <Popup>
            <p>{name}</p>
            <address>{address}</address>
          </Popup>
        </Marker>
      );
    }
  }
};
