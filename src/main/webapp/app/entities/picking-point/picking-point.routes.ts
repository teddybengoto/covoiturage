import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PickingPointComponent } from './list/picking-point.component';
import { PickingPointDetailComponent } from './detail/picking-point-detail.component';
import { PickingPointUpdateComponent } from './update/picking-point-update.component';
import PickingPointResolve from './route/picking-point-routing-resolve.service';

const pickingPointRoute: Routes = [
  {
    path: '',
    component: PickingPointComponent,
    data: {},
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PickingPointDetailComponent,
    resolve: {
      pickingPoint: PickingPointResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PickingPointUpdateComponent,
    resolve: {
      pickingPoint: PickingPointResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PickingPointUpdateComponent,
    resolve: {
      pickingPoint: PickingPointResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default pickingPointRoute;
