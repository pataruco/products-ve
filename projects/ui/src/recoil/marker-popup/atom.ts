import { atom } from 'recoil';

const markerPopUpAtom = atom({
  key: 'markerPopUp',
  default: {
    storeId: '',
    isOpen: false,
  },
});

export default markerPopUpAtom;
