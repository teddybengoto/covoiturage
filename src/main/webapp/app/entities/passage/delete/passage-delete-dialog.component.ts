import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IPassage } from '../passage.model';
import { PassageService } from '../service/passage.service';

@Component({
  standalone: true,
  templateUrl: './passage-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class PassageDeleteDialogComponent {
  passage?: IPassage;

  protected passageService = inject(PassageService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.passageService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
