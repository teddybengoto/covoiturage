import { IAuthority, NewAuthority } from './authority.model';

export const sampleWithRequiredData: IAuthority = {
  name: '0930ee41-e5d4-4484-a247-f156fba98075',
};

export const sampleWithPartialData: IAuthority = {
  name: 'b94d77f7-3cac-45f3-add3-1024bc6acceb',
};

export const sampleWithFullData: IAuthority = {
  name: '46ab98a8-6202-40e5-a752-fef7ea059ed7',
};

export const sampleWithNewData: NewAuthority = {
  name: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
