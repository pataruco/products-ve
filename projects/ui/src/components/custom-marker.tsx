import React from 'react';
import { Marker } from 'react-leaflet';
import { useRecoilState } from 'recoil';

import type { Store } from '../api/types.generated';
import markerPopUpAtom from '../recoil/marker-popup';

type CustomMarkerProps = Pick<Store, 'id' | 'coordinates'>;

// @ts-ignore
export const CustomMarker: React.FC<CustomMarkerProps> = ({
  id,
  coordinates,
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
