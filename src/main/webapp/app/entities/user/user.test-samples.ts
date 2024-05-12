import { IUser } from './user.model';

export const sampleWithRequiredData: IUser = {
  id: 'b1add2ea-ef22-4f92-add6-4c2878e12f84',
  login: 'F',
};

export const sampleWithPartialData: IUser = {
  id: '7fc5d42c-57ac-445e-a7c6-23367b1b0d29',
  login: 'xL6Wi@9p5O\\+z\\WLwhSjF\\<J',
};

export const sampleWithFullData: IUser = {
  id: '1e378b4d-a652-4dcf-a9ac-c9bf1353a28d',
  login: 'mP',
};
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
