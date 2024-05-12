import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { PickingPointDetailComponent } from './picking-point-detail.component';

describe('PickingPoint Management Detail Component', () => {
  let comp: PickingPointDetailComponent;
  let fixture: ComponentFixture<PickingPointDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PickingPointDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: PickingPointDetailComponent,
              resolve: { pickingPoint: () => of({ id: 'ABC' }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(PickingPointDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PickingPointDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load pickingPoint on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', PickingPointDetailComponent);

      // THEN
      expect(instance.pickingPoint()).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });

  describe('PreviousState', () => {
    it('Should navigate to previous state', () => {
      jest.spyOn(window.history, 'back');
      comp.previousState();
      expect(window.history.back).toHaveBeenCalled();
    });
  });
});
