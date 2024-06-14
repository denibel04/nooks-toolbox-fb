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
export class RegisterFormComponent {

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

 /**
   * Handles form submission.
   * Emits the onsubmit event with the form value (UserRegisterInfo).
   */
  onSubmit(){
    this.onsubmit.emit(this.form.value);
  } 
 /**
   * Checks if a specific form control or the entire form has a specific error.
   * @param control The name of the form control to check.
   * @param error The error name to check.
   * @param isFormError Boolean flag indicating if the error is a form-level error (not tied to a specific control).
   * @returns True if the control (or form) has the specified error, false otherwise.
   */
  hasError(control: string, error: string, isFormError: boolean = false): boolean {
    if (isFormError) {
      return this.form.hasError(error);
    } else {
      let controlErrors = this.form.controls[control].errors;
      return controlErrors != null && error in controlErrors;
    }
  }

}
