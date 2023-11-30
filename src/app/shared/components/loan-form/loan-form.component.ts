import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, AlertController } from '@ionic/angular';
import { Loan } from 'src/app/core/interfaces/loan';
import { LoanService } from 'src/app/core/services/loan.service';

@Component({
  selector: 'app-loan-form',
  templateUrl: './loan-form.component.html',
  styleUrls: ['./loan-form.component.scss'],
})
export class LoanFormComponent  implements OnInit {
  form:FormGroup;
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
    private loanService:LoanService,
    private alertController:AlertController
  ) {
    this.form = this.formBuilder.group({
      type: ['', Validators.required],
      amountPaid: [0, [Validators.required, Validators.min(0)]],
      amountTotal: [0, [Validators.required, Validators.min(0)]],
      completed: [false],
      title: ['', Validators.required],
    });
    this.form?.get('completed')?.valueChanges.subscribe(completed => {
      if (completed) {
        this.showConfirmPopup();
      }
    });
    this.form?.get('amountPaid')?.valueChanges.subscribe(amountPaid => {
      const amountTotal = this.form?.get('amountTotal')?.value;
      if (amountPaid >= amountTotal) {
        this.showConfirmPopup();
      }
    });
}

  ngOnInit(

  ) {}

  onCancel() {
    this.formModal.dismiss(null, 'cancel')
  }
  
  onSubmit() {
    this.formModal.dismiss(this.form?.value, 'submit')
  }

  async showConfirmPopup() {
    const alert = await this.alertController.create({
      header: 'Confirmar Pago',
      message: '¿Quieres pagar el total de la deuda?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            this.form?.get('completed')?.setValue(false, {emitEvent: false});
          }
        },
        {
          text: 'Sí',
          handler: () => {
            const amountTotal = this.form?.get('amountTotal')?.value;
            this.form?.get('amountPaid')?.setValue(amountTotal);
            this.formModal.dismiss(this.form?.value, 'submit')
          }
        }
      ]
    });

    await alert.present();
  }
  
}
