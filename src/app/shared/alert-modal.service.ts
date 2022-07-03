import { AlertModalComponent } from './alert-modal/alert-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Injectable } from '@angular/core';

export enum AlertTypes {
  DANGER = 'danger',
  SUCCESS = 'success',

}

@Injectable({
  providedIn: 'root'
})
export class AlertModalService {

  constructor(private modalService: BsModalService) { }
/**
 * 
 * @param message - Mensagem
 * @param type - Tipo da mensagem(error, danger, success e etc...)
 * Jeito de evitar a duplicação de código
 * A pessoa que estiver desenvolvendo, vai chamar só os métodos que não são o private, e vai passar somente a mensagem
 */
  private showAlert(message: string, type: AlertTypes, dismissTimeout?: number) {
    const bsModalRef: BsModalRef = this.modalService.show(AlertModalComponent);
    bsModalRef.content.type = type;
    bsModalRef.content.message = message;

    if (dismissTimeout) {
      setTimeout(() => {
        bsModalRef.hide();
      }, dismissTimeout);
    }
  }

  showAlertDanger(message: string) {
    this.showAlert(message, AlertTypes.DANGER);
  }

  showAlertSuccess(message: string) {
    this.showAlert(message, AlertTypes.SUCCESS, 3000);
  }
}
