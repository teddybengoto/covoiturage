import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPickingPoint, NewPickingPoint } from '../picking-point.model';

export type PartialUpdatePickingPoint = Partial<IPickingPoint> & Pick<IPickingPoint, 'id'>;

export type EntityResponseType = HttpResponse<IPickingPoint>;
export type EntityArrayResponseType = HttpResponse<IPickingPoint[]>;

@Injectable({ providedIn: 'root' })
export class PickingPointService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/picking-points');

  create(pickingPoint: NewPickingPoint): Observable<EntityResponseType> {
    return this.http.post<IPickingPoint>(this.resourceUrl, pickingPoint, { observe: 'response' });
  }

  update(pickingPoint: IPickingPoint): Observable<EntityResponseType> {
    return this.http.put<IPickingPoint>(`${this.resourceUrl}/${this.getPickingPointIdentifier(pickingPoint)}`, pickingPoint, {
      observe: 'response',
    });
  }

  partialUpdate(pickingPoint: PartialUpdatePickingPoint): Observable<EntityResponseType> {
    return this.http.patch<IPickingPoint>(`${this.resourceUrl}/${this.getPickingPointIdentifier(pickingPoint)}`, pickingPoint, {
      observe: 'response',
    });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IPickingPoint>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPickingPoint[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPickingPointIdentifier(pickingPoint: Pick<IPickingPoint, 'id'>): string {
    return pickingPoint.id;
  }

  comparePickingPoint(o1: Pick<IPickingPoint, 'id'> | null, o2: Pick<IPickingPoint, 'id'> | null): boolean {
    return o1 && o2 ? this.getPickingPointIdentifier(o1) === this.getPickingPointIdentifier(o2) : o1 === o2;
  }

  addPickingPointToCollectionIfMissing<Type extends Pick<IPickingPoint, 'id'>>(
    pickingPointCollection: Type[],
    ...pickingPointsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const pickingPoints: Type[] = pickingPointsToCheck.filter(isPresent);
    if (pickingPoints.length > 0) {
      const pickingPointCollectionIdentifiers = pickingPointCollection.map(pickingPointItem =>
        this.getPickingPointIdentifier(pickingPointItem),
      );
      const pickingPointsToAdd = pickingPoints.filter(pickingPointItem => {
        const pickingPointIdentifier = this.getPickingPointIdentifier(pickingPointItem);
        if (pickingPointCollectionIdentifiers.includes(pickingPointIdentifier)) {
          return false;
        }
        pickingPointCollectionIdentifiers.push(pickingPointIdentifier);
        return true;
      });
      return [...pickingPointsToAdd, ...pickingPointCollection];
    }
    return pickingPointCollection;
  }
}
