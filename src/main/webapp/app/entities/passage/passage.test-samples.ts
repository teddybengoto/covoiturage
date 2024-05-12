import dayjs from 'dayjs/esm';

import { IPassage, NewPassage } from './passage.model';

export const sampleWithRequiredData: IPassage = {
  id: 'a9df4e88-6eb2-4184-86c4-6929cce3f326',
  starDate: dayjs('2024-05-12'),
  endDate: dayjs('2024-05-11'),
  time: dayjs('2024-05-11'),
  seat: 15935,
};

export const sampleWithPartialData: IPassage = {
  id: '8ae3202e-1ea0-40e0-9685-556de478dac7',
  starDate: dayjs('2024-05-11'),
  endDate: dayjs('2024-05-11'),
  time: dayjs('2024-05-11'),
  seat: 31591,
};

export const sampleWithFullData: IPassage = {
  id: 'a0ddf0cd-6483-46bd-a8ad-43d967145419',
  starDate: dayjs('2024-05-12'),
  endDate: dayjs('2024-05-11'),
  time: dayjs('2024-05-11'),
  seat: 6282,
};

export const sampleWithNewData: NewPassage = {
  starDate: dayjs('2024-05-11'),
  endDate: dayjs('2024-05-12'),
  time: dayjs('2024-05-12'),
  seat: 22885,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
