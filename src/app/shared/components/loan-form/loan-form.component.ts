import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { Loan } from 'src/app/core/interfaces/loan';
import { LoanService } from 'src/app/core/services/loan.service';

@Component({
  selector: 'app-loan-form',
  templateUrl: './loan-form.component.html',
  styleUrls: ['./loan-form.component.scss'],
})
export class LoanFormComponent {
  form: FormGroup;
  mode: 'New' | 'Edit' = 'New';

  @Input() set loan(_loan: Loan | null) {
    if (_loan) {
      this.mode = 'Edit';
      this.form.controls['amountPaid'].setValue(_loan.attributes.amountPaid);
      this.form.controls['completed'].setValue(_loan.attributes.completed);
      this.form.controls['type'].setValue(_loan.attributes.type);
      this.form.controls['amountTotal'].setValue(_loan.attributes.amountTotal);
      this.form.controls['title'].setValue(_loan.attributes.title);
    }
  }

  constructor(
    private formModal: ModalController,
    private formBuilder: FormBuilder,
    private loanService: LoanService,
    private alertController: AlertController,
    private translate: TranslateService
  ) {
    this.form = this.formBuilder.group({
      type: ['', Validators.required],
      amountPaid: [0, [Validators.required, Validators.min(0)]],
      amountTotal: [0, [Validators.required, Validators.min(0)]],
      completed: [false],
      title: ['', Validators.required],
    });
  }

  /**
     * Cancels the form operation and dismisses the modal with 'cancel' action.
     */
  onCancel() {
    this.formModal.dismiss(null, 'cancel')
  }

  /**
   * Submits the form data.
   * Checks if the loan amount paid exceeds the total amount and shows a confirmation popup if needed.
   * Dismisses the modal with 'submit' action if confirmed, otherwise updates form values.
   */
  onSubmit() {
    const amountPaid = this.form.get('amountPaid')?.value;
    const amountTotal = this.form.get('amountTotal')?.value;
    const completed = this.form.get('completed')?.value;
    if ((amountPaid >= amountTotal && !completed) || (completed && amountPaid < amountTotal)) {
      this.showConfirmPopup();
    } else {
      this.formModal.dismiss(this.form.value, 'submit');
    }
  }
  /**
    * Displays a confirmation popup for completing the loan.
    * Updates form values based on user response and dismisses the modal with 'submit' action.
    */
  async showConfirmPopup() {
    const alert = await this.alertController.create({
      mode: 'ios',
      header: await lastValueFrom(this.translate.get('loans.confirm.header')),
      message: await lastValueFrom(this.translate.get('loans.confirm.message')),
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            this.form?.get('completed')?.setValue(false, { emitEvent: false });
          }
        },
        {
          text: await lastValueFrom(this.translate.get('loans.confirm.yes')),
          handler: () => {
            const amountTotal = this.form?.get('amountTotal')?.value;
            this.form?.get('amountPaid')?.setValue(amountTotal);
            this.form?.get('completed')?.setValue(true);
            this.formModal.dismiss(this.form?.value, 'submit');
          }
        }
      ]
    });

    await alert.present();
  }


}
