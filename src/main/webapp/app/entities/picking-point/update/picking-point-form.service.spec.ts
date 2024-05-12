import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../picking-point.test-samples';

import { PickingPointFormService } from './picking-point-form.service';

describe('PickingPoint Form Service', () => {
  let service: PickingPointFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PickingPointFormService);
  });

  describe('Service methods', () => {
    describe('createPickingPointFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPickingPointFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            adresse: expect.any(Object),
          }),
        );
      });

      it('passing IPickingPoint should create a new form with FormGroup', () => {
        const formGroup = service.createPickingPointFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            adresse: expect.any(Object),
          }),
        );
      });
    });

    describe('getPickingPoint', () => {
      it('should return NewPickingPoint for default PickingPoint initial value', () => {
        const formGroup = service.createPickingPointFormGroup(sampleWithNewData);

        const pickingPoint = service.getPickingPoint(formGroup) as any;

        expect(pickingPoint).toMatchObject(sampleWithNewData);
      });

      it('should return NewPickingPoint for empty PickingPoint initial value', () => {
        const formGroup = service.createPickingPointFormGroup();

        const pickingPoint = service.getPickingPoint(formGroup) as any;

        expect(pickingPoint).toMatchObject({});
      });

      it('should return IPickingPoint', () => {
        const formGroup = service.createPickingPointFormGroup(sampleWithRequiredData);

        const pickingPoint = service.getPickingPoint(formGroup) as any;

        expect(pickingPoint).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPickingPoint should not enable id FormControl', () => {
        const formGroup = service.createPickingPointFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPickingPoint should disable id FormControl', () => {
        const formGroup = service.createPickingPointFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
