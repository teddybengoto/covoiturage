import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IPickingPoint } from 'app/entities/picking-point/picking-point.model';
import { PickingPointService } from 'app/entities/picking-point/service/picking-point.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/service/user.service';
import { PassageService } from '../service/passage.service';
import { IPassage } from '../passage.model';
import { PassageFormService, PassageFormGroup } from './passage-form.service';

@Component({
  standalone: true,
  selector: 'jhi-passage-update',
  templateUrl: './passage-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class PassageUpdateComponent implements OnInit {
  isSaving = false;
  passage: IPassage | null = null;

  passeBiesCollection: IPickingPoint[] = [];
  usersSharedCollection: IUser[] = [];

  protected passageService = inject(PassageService);
  protected passageFormService = inject(PassageFormService);
  protected pickingPointService = inject(PickingPointService);
  protected userService = inject(UserService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: PassageFormGroup = this.passageFormService.createPassageFormGroup();

  comparePickingPoint = (o1: IPickingPoint | null, o2: IPickingPoint | null): boolean =>
    this.pickingPointService.comparePickingPoint(o1, o2);

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ passage }) => {
      this.passage = passage;
      if (passage) {
        this.updateForm(passage);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const passage = this.passageFormService.getPassage(this.editForm);
    if (passage.id !== null) {
      this.subscribeToSaveResponse(this.passageService.update(passage));
    } else {
      this.subscribeToSaveResponse(this.passageService.create(passage));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPassage>>): void {
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

  protected updateForm(passage: IPassage): void {
    this.passage = passage;
    this.passageFormService.resetForm(this.editForm, passage);

    this.passeBiesCollection = this.pickingPointService.addPickingPointToCollectionIfMissing<IPickingPoint>(
      this.passeBiesCollection,
      passage.passeBy,
    );
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, passage.driver);
  }

  protected loadRelationshipsOptions(): void {
    this.pickingPointService
      .query({ filter: 'passages-is-null' })
      .pipe(map((res: HttpResponse<IPickingPoint[]>) => res.body ?? []))
      .pipe(
        map((pickingPoints: IPickingPoint[]) =>
          this.pickingPointService.addPickingPointToCollectionIfMissing<IPickingPoint>(pickingPoints, this.passage?.passeBy),
        ),
      )
      .subscribe((pickingPoints: IPickingPoint[]) => (this.passeBiesCollection = pickingPoints));

    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.passage?.driver)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
