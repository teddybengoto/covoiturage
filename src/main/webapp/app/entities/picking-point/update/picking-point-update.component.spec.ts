import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject, from } from 'rxjs';

import { PickingPointService } from '../service/picking-point.service';
import { IPickingPoint } from '../picking-point.model';
import { PickingPointFormService } from './picking-point-form.service';

import { PickingPointUpdateComponent } from './picking-point-update.component';

describe('PickingPoint Management Update Component', () => {
  let comp: PickingPointUpdateComponent;
  let fixture: ComponentFixture<PickingPointUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let pickingPointFormService: PickingPointFormService;
  let pickingPointService: PickingPointService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, PickingPointUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(PickingPointUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PickingPointUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    pickingPointFormService = TestBed.inject(PickingPointFormService);
    pickingPointService = TestBed.inject(PickingPointService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const pickingPoint: IPickingPoint = { id: 'CBA' };

      activatedRoute.data = of({ pickingPoint });
      comp.ngOnInit();

      expect(comp.pickingPoint).toEqual(pickingPoint);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPickingPoint>>();
      const pickingPoint = { id: 'ABC' };
      jest.spyOn(pickingPointFormService, 'getPickingPoint').mockReturnValue(pickingPoint);
      jest.spyOn(pickingPointService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pickingPoint });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: pickingPoint }));
      saveSubject.complete();

      // THEN
      expect(pickingPointFormService.getPickingPoint).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(pickingPointService.update).toHaveBeenCalledWith(expect.objectContaining(pickingPoint));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPickingPoint>>();
      const pickingPoint = { id: 'ABC' };
      jest.spyOn(pickingPointFormService, 'getPickingPoint').mockReturnValue({ id: null });
      jest.spyOn(pickingPointService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pickingPoint: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: pickingPoint }));
      saveSubject.complete();

      // THEN
      expect(pickingPointFormService.getPickingPoint).toHaveBeenCalled();
      expect(pickingPointService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPickingPoint>>();
      const pickingPoint = { id: 'ABC' };
      jest.spyOn(pickingPointService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pickingPoint });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(pickingPointService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
