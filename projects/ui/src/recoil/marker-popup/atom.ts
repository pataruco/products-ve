import { atom } from 'recoil';

const markerPopUpAtom = atom({
  key: 'markerPopUp', // unique ID (with respect to other atoms/selectors)
  default: '', // default value (aka initial value)
});

export default markerPopUpAtom;
