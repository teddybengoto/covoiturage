import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../passage.test-samples';

import { PassageFormService } from './passage-form.service';

describe('Passage Form Service', () => {
  let service: PassageFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PassageFormService);
  });

  describe('Service methods', () => {
    describe('createPassageFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPassageFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            starDate: expect.any(Object),
            endDate: expect.any(Object),
            time: expect.any(Object),
            seat: expect.any(Object),
            passeBy: expect.any(Object),
            driver: expect.any(Object),
          }),
        );
      });

      it('passing IPassage should create a new form with FormGroup', () => {
        const formGroup = service.createPassageFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            starDate: expect.any(Object),
            endDate: expect.any(Object),
            time: expect.any(Object),
            seat: expect.any(Object),
            passeBy: expect.any(Object),
            driver: expect.any(Object),
          }),
        );
      });
    });

    describe('getPassage', () => {
      it('should return NewPassage for default Passage initial value', () => {
        const formGroup = service.createPassageFormGroup(sampleWithNewData);

        const passage = service.getPassage(formGroup) as any;

        expect(passage).toMatchObject(sampleWithNewData);
      });

      it('should return NewPassage for empty Passage initial value', () => {
        const formGroup = service.createPassageFormGroup();

        const passage = service.getPassage(formGroup) as any;

        expect(passage).toMatchObject({});
      });

      it('should return IPassage', () => {
        const formGroup = service.createPassageFormGroup(sampleWithRequiredData);

        const passage = service.getPassage(formGroup) as any;

        expect(passage).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPassage should not enable id FormControl', () => {
        const formGroup = service.createPassageFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPassage should disable id FormControl', () => {
        const formGroup = service.createPassageFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
