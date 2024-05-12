import { IPickingPoint, NewPickingPoint } from './picking-point.model';

export const sampleWithRequiredData: IPickingPoint = {
  id: '08729557-2a4e-4f49-9efd-50dad82a34fa',
  name: 'maintenant cadre',
  adresse: 'chut',
};

export const sampleWithPartialData: IPickingPoint = {
  id: '13a80bce-4a91-49f2-b56d-687e524c6254',
  name: 'autrement',
  adresse: 'plus fusiller',
};

export const sampleWithFullData: IPickingPoint = {
  id: 'd86263b4-6293-4ada-bba0-34475efffa16',
  name: 'cot cot glouglou',
  adresse: 'sauf',
};

export const sampleWithNewData: NewPickingPoint = {
  name: 'pourvu que',
  adresse: 'combien trop au cas où',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
