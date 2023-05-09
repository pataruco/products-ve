import React from 'react';
import { Marker } from 'react-leaflet';
import { useRecoilState } from 'recoil';
import markerPopUpAtom from '../recoil/marker-popup';

import type { Store } from '../api/types.generated';

// @ts-ignore
export const CustomMarker: React.FC<Store> = ({
  id,
  coordinates,
  name,
  address,
}) => {
  const [_, setMarkerPopUp] = useRecoilState(markerPopUpAtom);

  const handleOnClick = () => {
    if (id) {
      setMarkerPopUp(id);
    }
  };

  if (coordinates) {
    const { lat, lng } = coordinates;
    if (lat && lng) {
      return (
        <Marker
          position={[lat, lng]}
          key={id}
          eventHandlers={{ click: handleOnClick }}
        />
      );
    }
  }
};
