import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IPickingPoint } from '../picking-point.model';

@Component({
  standalone: true,
  selector: 'jhi-picking-point-detail',
  templateUrl: './picking-point-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class PickingPointDetailComponent {
  pickingPoint = input<IPickingPoint | null>(null);

  previousState(): void {
    window.history.back();
  }
}
