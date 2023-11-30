import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { LoanService } from 'src/app/core/services/loan.service';

@Component({
  selector: 'app-loan-form',
  templateUrl: './loan-form.component.html',
  styleUrls: ['./loan-form.component.scss'],
})
export class LoanFormComponent  implements OnInit {
  form:FormGroup;

  constructor(
    private formModal: ModalController,
    private formBuilder: FormBuilder,
    private loanService:LoanService
  ) {
    this.form = this.formBuilder.group({
      type: ['', Validators.required],
      amountPaid: [0, [Validators.required, Validators.min(0)]],
      amountTotal: [0, [Validators.required, Validators.min(0)]],
      completed: [false],
      title: ['', Validators.required],
    });
}

  ngOnInit() {}

  onCancel() {
    this.formModal.dismiss(null, 'cancel')
  }
  
  onSubmit() {
    this.formModal.dismiss(this.form?.value, 'submit')
  }
}
