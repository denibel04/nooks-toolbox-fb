import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserCredentials } from 'src/app/core/interfaces/user-credentials';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent  {

  @Input('username') set username(value:string){
    this.form?.controls['username'].setValue(value);
  }

  @Output() onsubmit = new EventEmitter<UserCredentials>();

  form:FormGroup|null = null;
  constructor(
    private formBuilder:FormBuilder
  ) { 
    this.form = this.formBuilder.group({
      username:['', [Validators.required]],
      password:['', [Validators.required]]
    });
  }

   /**
   * Handles form submission.
   * Emits the onsubmit event with the form value (UserCredentials) and resets the password field.
   */
  onSubmit(){
    this.onsubmit.emit(this.form?.value);
    this.form?.controls['password'].setValue('');
  }

}