export interface IPickingPoint {
  id: string;
  name?: string | null;
  adresse?: string | null;
}

export type NewPickingPoint = Omit<IPickingPoint, 'id'> & { id: null };
