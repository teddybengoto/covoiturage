import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { PassageDetailComponent } from './passage-detail.component';

describe('Passage Management Detail Component', () => {
  let comp: PassageDetailComponent;
  let fixture: ComponentFixture<PassageDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PassageDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: PassageDetailComponent,
              resolve: { passage: () => of({ id: 'ABC' }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(PassageDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PassageDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load passage on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', PassageDetailComponent);

      // THEN
      expect(instance.passage()).toEqual(expect.objectContaining({ id: 'ABC' }));
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
