import dayjs from 'dayjs/esm';
import { IPickingPoint } from 'app/entities/picking-point/picking-point.model';
import { IUser } from 'app/entities/user/user.model';

export interface IPassage {
  id: string;
  starDate?: dayjs.Dayjs | null;
  endDate?: dayjs.Dayjs | null;
  time?: dayjs.Dayjs | null;
  seat?: number | null;
  passeBy?: IPickingPoint | null;
  driver?: Pick<IUser, 'id'> | null;
}

export type NewPassage = Omit<IPassage, 'id'> & { id: null };
