import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPassage, NewPassage } from '../passage.model';

export type PartialUpdatePassage = Partial<IPassage> & Pick<IPassage, 'id'>;

type RestOf<T extends IPassage | NewPassage> = Omit<T, 'starDate' | 'endDate' | 'time'> & {
  starDate?: string | null;
  endDate?: string | null;
  time?: string | null;
};

export type RestPassage = RestOf<IPassage>;

export type NewRestPassage = RestOf<NewPassage>;

export type PartialUpdateRestPassage = RestOf<PartialUpdatePassage>;

export type EntityResponseType = HttpResponse<IPassage>;
export type EntityArrayResponseType = HttpResponse<IPassage[]>;

@Injectable({ providedIn: 'root' })
export class PassageService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/passages');

  create(passage: NewPassage): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(passage);
    return this.http
      .post<RestPassage>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(passage: IPassage): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(passage);
    return this.http
      .put<RestPassage>(`${this.resourceUrl}/${this.getPassageIdentifier(passage)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(passage: PartialUpdatePassage): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(passage);
    return this.http
      .patch<RestPassage>(`${this.resourceUrl}/${this.getPassageIdentifier(passage)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http
      .get<RestPassage>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestPassage[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPassageIdentifier(passage: Pick<IPassage, 'id'>): string {
    return passage.id;
  }

  comparePassage(o1: Pick<IPassage, 'id'> | null, o2: Pick<IPassage, 'id'> | null): boolean {
    return o1 && o2 ? this.getPassageIdentifier(o1) === this.getPassageIdentifier(o2) : o1 === o2;
  }

  addPassageToCollectionIfMissing<Type extends Pick<IPassage, 'id'>>(
    passageCollection: Type[],
    ...passagesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const passages: Type[] = passagesToCheck.filter(isPresent);
    if (passages.length > 0) {
      const passageCollectionIdentifiers = passageCollection.map(passageItem => this.getPassageIdentifier(passageItem));
      const passagesToAdd = passages.filter(passageItem => {
        const passageIdentifier = this.getPassageIdentifier(passageItem);
        if (passageCollectionIdentifiers.includes(passageIdentifier)) {
          return false;
        }
        passageCollectionIdentifiers.push(passageIdentifier);
        return true;
      });
      return [...passagesToAdd, ...passageCollection];
    }
    return passageCollection;
  }

  protected convertDateFromClient<T extends IPassage | NewPassage | PartialUpdatePassage>(passage: T): RestOf<T> {
    return {
      ...passage,
      starDate: passage.starDate?.format(DATE_FORMAT) ?? null,
      endDate: passage.endDate?.format(DATE_FORMAT) ?? null,
      time: passage.time?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restPassage: RestPassage): IPassage {
    return {
      ...restPassage,
      starDate: restPassage.starDate ? dayjs(restPassage.starDate) : undefined,
      endDate: restPassage.endDate ? dayjs(restPassage.endDate) : undefined,
      time: restPassage.time ? dayjs(restPassage.time) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestPassage>): HttpResponse<IPassage> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestPassage[]>): HttpResponse<IPassage[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
