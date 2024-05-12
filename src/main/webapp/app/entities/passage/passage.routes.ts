import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PassageComponent } from './list/passage.component';
import { PassageDetailComponent } from './detail/passage-detail.component';
import { PassageUpdateComponent } from './update/passage-update.component';
import PassageResolve from './route/passage-routing-resolve.service';

const passageRoute: Routes = [
  {
    path: '',
    component: PassageComponent,
    data: {},
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PassageDetailComponent,
    resolve: {
      passage: PassageResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PassageUpdateComponent,
    resolve: {
      passage: PassageResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PassageUpdateComponent,
    resolve: {
      passage: PassageResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default passageRoute;
