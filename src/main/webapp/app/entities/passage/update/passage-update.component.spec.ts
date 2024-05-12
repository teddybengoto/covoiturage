import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject, from } from 'rxjs';

import { IPickingPoint } from 'app/entities/picking-point/picking-point.model';
import { PickingPointService } from 'app/entities/picking-point/service/picking-point.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/service/user.service';
import { IPassage } from '../passage.model';
import { PassageService } from '../service/passage.service';
import { PassageFormService } from './passage-form.service';

import { PassageUpdateComponent } from './passage-update.component';

describe('Passage Management Update Component', () => {
  let comp: PassageUpdateComponent;
  let fixture: ComponentFixture<PassageUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let passageFormService: PassageFormService;
  let passageService: PassageService;
  let pickingPointService: PickingPointService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, PassageUpdateComponent],
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
      .overrideTemplate(PassageUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PassageUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    passageFormService = TestBed.inject(PassageFormService);
    passageService = TestBed.inject(PassageService);
    pickingPointService = TestBed.inject(PickingPointService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call passeBy query and add missing value', () => {
      const passage: IPassage = { id: 'CBA' };
      const passeBy: IPickingPoint = { id: '1373e2c9-bb24-4407-a581-dea88930b3c2' };
      passage.passeBy = passeBy;

      const passeByCollection: IPickingPoint[] = [{ id: 'ea01eb7a-0e23-44ec-96d4-cf16a77ac9a3' }];
      jest.spyOn(pickingPointService, 'query').mockReturnValue(of(new HttpResponse({ body: passeByCollection })));
      const expectedCollection: IPickingPoint[] = [passeBy, ...passeByCollection];
      jest.spyOn(pickingPointService, 'addPickingPointToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ passage });
      comp.ngOnInit();

      expect(pickingPointService.query).toHaveBeenCalled();
      expect(pickingPointService.addPickingPointToCollectionIfMissing).toHaveBeenCalledWith(passeByCollection, passeBy);
      expect(comp.passeBiesCollection).toEqual(expectedCollection);
    });

    it('Should call User query and add missing value', () => {
      const passage: IPassage = { id: 'CBA' };
      const driver: IUser = { id: 'a494989b-987e-4a2b-b006-e38ce01c5df9' };
      passage.driver = driver;

      const userCollection: IUser[] = [{ id: '617dd699-e03b-4d9f-aeb1-a2b0b3c12e9f' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [driver];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ passage });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining),
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const passage: IPassage = { id: 'CBA' };
      const passeBy: IPickingPoint = { id: 'd53e87af-62ce-43a7-ae08-5dbe4f03c9e3' };
      passage.passeBy = passeBy;
      const driver: IUser = { id: '8e3c1ae1-63e5-40f8-b4bd-478ed52b5e7f' };
      passage.driver = driver;

      activatedRoute.data = of({ passage });
      comp.ngOnInit();

      expect(comp.passeBiesCollection).toContain(passeBy);
      expect(comp.usersSharedCollection).toContain(driver);
      expect(comp.passage).toEqual(passage);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPassage>>();
      const passage = { id: 'ABC' };
      jest.spyOn(passageFormService, 'getPassage').mockReturnValue(passage);
      jest.spyOn(passageService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ passage });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: passage }));
      saveSubject.complete();

      // THEN
      expect(passageFormService.getPassage).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(passageService.update).toHaveBeenCalledWith(expect.objectContaining(passage));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPassage>>();
      const passage = { id: 'ABC' };
      jest.spyOn(passageFormService, 'getPassage').mockReturnValue({ id: null });
      jest.spyOn(passageService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ passage: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: passage }));
      saveSubject.complete();

      // THEN
      expect(passageFormService.getPassage).toHaveBeenCalled();
      expect(passageService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPassage>>();
      const passage = { id: 'ABC' };
      jest.spyOn(passageService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ passage });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(passageService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('comparePickingPoint', () => {
      it('Should forward to pickingPointService', () => {
        const entity = { id: 'ABC' };
        const entity2 = { id: 'CBA' };
        jest.spyOn(pickingPointService, 'comparePickingPoint');
        comp.comparePickingPoint(entity, entity2);
        expect(pickingPointService.comparePickingPoint).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 'ABC' };
        const entity2 = { id: 'CBA' };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
