import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IPassage } from '../passage.model';

@Component({
  standalone: true,
  selector: 'jhi-passage-detail',
  templateUrl: './passage-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class PassageDetailComponent {
  passage = input<IPassage | null>(null);

  previousState(): void {
    window.history.back();
  }
}
