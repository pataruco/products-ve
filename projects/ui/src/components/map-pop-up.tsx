import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

import { useStoreQuery } from '../api/operations.generated';
import markerPopUpAtom from '../recoil/marker-popup';

const StyledMapPopUp = styled.div`
  background-color: white;
  inset: auto 0 0;
  padding: 0 var(--base-padding) var(--base-padding);
  position: absolute;
  z-index: 1000;
  border-top-right-radius: 2rem;
  border-top-left-radius: 2rem;
`;

const MapPopUp = () => {
  const storeId = useRecoilValue(markerPopUpAtom);

  const { data, error, loading } = useStoreQuery({
    variables: {
      storeId,
    },
  });

  if (loading) return <p>Loading...</p>;

  if (error) return null;

  if (data?.store) {
    const {
      store: { name, address, coordinates },
    } = data;

    if (coordinates) {
      const { lat, lng } = coordinates;

      return (
        <StyledMapPopUp>
          <h2>{name}</h2>
          <address>{address}</address>
          <p>
            <a
              href={`https://maps.apple.com/?dirflg=w&daddr=${lat},${lng}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              Directions
            </a>
          </p>
        </StyledMapPopUp>
      );
    }
  }
  return null;
};

export default MapPopUp;
