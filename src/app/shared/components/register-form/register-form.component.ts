import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
})
export class RegisterFormComponent  implements OnInit {

  form:FormGroup;

  constructor(
    private formModal: ModalController,
    private formBuilder:FormBuilder) {
    this.form = this.formBuilder.group({
      username:['', [Validators.required]],
      display_name:['', [Validators.required]],
      email:['', [Validators.required]],
      password:['', [Validators.required]]
    });
  }

  ngOnInit() {}

  onCancel(){
    this.formModal.dismiss(null, 'cancel');
  }

  onSubmit(){
    this.formModal.dismiss(this.form?.value, 'submit');
  } 

}
