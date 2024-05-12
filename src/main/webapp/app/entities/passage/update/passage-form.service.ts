import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IPassage, NewPassage } from '../passage.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPassage for edit and NewPassageFormGroupInput for create.
 */
type PassageFormGroupInput = IPassage | PartialWithRequiredKeyOf<NewPassage>;

type PassageFormDefaults = Pick<NewPassage, 'id'>;

type PassageFormGroupContent = {
  id: FormControl<IPassage['id'] | NewPassage['id']>;
  starDate: FormControl<IPassage['starDate']>;
  endDate: FormControl<IPassage['endDate']>;
  time: FormControl<IPassage['time']>;
  seat: FormControl<IPassage['seat']>;
  passeBy: FormControl<IPassage['passeBy']>;
  driver: FormControl<IPassage['driver']>;
};

export type PassageFormGroup = FormGroup<PassageFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PassageFormService {
  createPassageFormGroup(passage: PassageFormGroupInput = { id: null }): PassageFormGroup {
    const passageRawValue = {
      ...this.getFormDefaults(),
      ...passage,
    };
    return new FormGroup<PassageFormGroupContent>({
      id: new FormControl(
        { value: passageRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      starDate: new FormControl(passageRawValue.starDate, {
        validators: [Validators.required],
      }),
      endDate: new FormControl(passageRawValue.endDate, {
        validators: [Validators.required],
      }),
      time: new FormControl(passageRawValue.time, {
        validators: [Validators.required],
      }),
      seat: new FormControl(passageRawValue.seat, {
        validators: [Validators.required],
      }),
      passeBy: new FormControl(passageRawValue.passeBy, {
        validators: [Validators.required],
      }),
      driver: new FormControl(passageRawValue.driver, {
        validators: [Validators.required],
      }),
    });
  }

  getPassage(form: PassageFormGroup): IPassage | NewPassage {
    return form.getRawValue() as IPassage | NewPassage;
  }

  resetForm(form: PassageFormGroup, passage: PassageFormGroupInput): void {
    const passageRawValue = { ...this.getFormDefaults(), ...passage };
    form.reset(
      {
        ...passageRawValue,
        id: { value: passageRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): PassageFormDefaults {
    return {
      id: null,
    };
  }
}
