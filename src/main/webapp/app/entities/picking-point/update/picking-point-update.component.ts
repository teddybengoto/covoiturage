import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IPickingPoint } from '../picking-point.model';
import { PickingPointService } from '../service/picking-point.service';
import { PickingPointFormService, PickingPointFormGroup } from './picking-point-form.service';

@Component({
  standalone: true,
  selector: 'jhi-picking-point-update',
  templateUrl: './picking-point-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class PickingPointUpdateComponent implements OnInit {
  isSaving = false;
  pickingPoint: IPickingPoint | null = null;

  protected pickingPointService = inject(PickingPointService);
  protected pickingPointFormService = inject(PickingPointFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: PickingPointFormGroup = this.pickingPointFormService.createPickingPointFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pickingPoint }) => {
      this.pickingPoint = pickingPoint;
      if (pickingPoint) {
        this.updateForm(pickingPoint);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const pickingPoint = this.pickingPointFormService.getPickingPoint(this.editForm);
    if (pickingPoint.id !== null) {
      this.subscribeToSaveResponse(this.pickingPointService.update(pickingPoint));
    } else {
      this.subscribeToSaveResponse(this.pickingPointService.create(pickingPoint));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPickingPoint>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(pickingPoint: IPickingPoint): void {
    this.pickingPoint = pickingPoint;
    this.pickingPointFormService.resetForm(this.editForm, pickingPoint);
  }
}
