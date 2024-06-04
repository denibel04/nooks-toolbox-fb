import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { UserRegisterInfo } from 'src/app/core/interfaces/user-register-info';
import { PasswordValidation } from 'src/app/core/validators/password';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
})
export class RegisterFormComponent  implements OnInit {

  form:FormGroup;

  @Output() onsubmit = new EventEmitter<UserRegisterInfo>();

  constructor(
    private formBuilder:FormBuilder) {
    this.form = this.formBuilder.group({
      username:['', [Validators.required]],
      email:['', [Validators.required]],
      password:['', [Validators.required, PasswordValidation.passwordProto()]],
      confirm: ['', [Validators.required, PasswordValidation.passwordProto()]]
    }, { validators: PasswordValidation.passwordMatch('password', 'confirm') }
    );
  }

  ngOnInit() {}

  onSubmit(){
    this.onsubmit.emit(this.form.value);
  } 

  hasError(control: string, error: string, isFormError: boolean = false): boolean {
    if (isFormError) {
      return this.form.hasError(error);
    } else {
      let controlErrors = this.form.controls[control].errors;
      return controlErrors != null && error in controlErrors;
    }
  }

}
