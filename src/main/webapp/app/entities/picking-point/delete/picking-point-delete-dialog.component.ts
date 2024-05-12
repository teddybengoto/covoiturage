import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IPickingPoint } from '../picking-point.model';
import { PickingPointService } from '../service/picking-point.service';

@Component({
  standalone: true,
  templateUrl: './picking-point-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class PickingPointDeleteDialogComponent {
  pickingPoint?: IPickingPoint;

  protected pickingPointService = inject(PickingPointService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.pickingPointService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
