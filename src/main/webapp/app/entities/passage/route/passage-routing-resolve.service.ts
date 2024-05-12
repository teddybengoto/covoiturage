import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPassage } from '../passage.model';
import { PassageService } from '../service/passage.service';

const passageResolve = (route: ActivatedRouteSnapshot): Observable<null | IPassage> => {
  const id = route.params['id'];
  if (id) {
    return inject(PassageService)
      .find(id)
      .pipe(
        mergeMap((passage: HttpResponse<IPassage>) => {
          if (passage.body) {
            return of(passage.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default passageResolve;
