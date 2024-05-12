import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'covoiturageApp.adminAuthority.home.title' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'picking-point',
    data: { pageTitle: 'covoiturageApp.pickingPoint.home.title' },
    loadChildren: () => import('./picking-point/picking-point.routes'),
  },
  {
    path: 'passage',
    data: { pageTitle: 'covoiturageApp.passage.home.title' },
    loadChildren: () => import('./passage/passage.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
