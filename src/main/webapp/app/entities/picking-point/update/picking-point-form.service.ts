import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IPickingPoint, NewPickingPoint } from '../picking-point.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPickingPoint for edit and NewPickingPointFormGroupInput for create.
 */
type PickingPointFormGroupInput = IPickingPoint | PartialWithRequiredKeyOf<NewPickingPoint>;

type PickingPointFormDefaults = Pick<NewPickingPoint, 'id'>;

type PickingPointFormGroupContent = {
  id: FormControl<IPickingPoint['id'] | NewPickingPoint['id']>;
  name: FormControl<IPickingPoint['name']>;
  adresse: FormControl<IPickingPoint['adresse']>;
};

export type PickingPointFormGroup = FormGroup<PickingPointFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PickingPointFormService {
  createPickingPointFormGroup(pickingPoint: PickingPointFormGroupInput = { id: null }): PickingPointFormGroup {
    const pickingPointRawValue = {
      ...this.getFormDefaults(),
      ...pickingPoint,
    };
    return new FormGroup<PickingPointFormGroupContent>({
      id: new FormControl(
        { value: pickingPointRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(pickingPointRawValue.name, {
        validators: [Validators.required],
      }),
      adresse: new FormControl(pickingPointRawValue.adresse, {
        validators: [Validators.required],
      }),
    });
  }

  getPickingPoint(form: PickingPointFormGroup): IPickingPoint | NewPickingPoint {
    return form.getRawValue() as IPickingPoint | NewPickingPoint;
  }

  resetForm(form: PickingPointFormGroup, pickingPoint: PickingPointFormGroupInput): void {
    const pickingPointRawValue = { ...this.getFormDefaults(), ...pickingPoint };
    form.reset(
      {
        ...pickingPointRawValue,
        id: { value: pickingPointRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): PickingPointFormDefaults {
    return {
      id: null,
    };
  }
}
