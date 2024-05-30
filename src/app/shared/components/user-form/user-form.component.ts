import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { User } from 'src/app/core/interfaces/user';
import { NgOtpInputModule } from 'ng-otp-input';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  imports: [NgOtpInputModule]
})
export class UserFormComponent {
  userForm: FormGroup;

  @Input() set user(_user: User | null) { 
    if (_user) {
      this.userForm.controls['username'].setValue(_user.username);
      if (_user.dream_code) {
        this.userForm.controls['dream_code'].setValue(_user.dream_code);
      }
      if (_user.profile_picture) {
        this.userForm.controls['profile_picture'].setValue(_user.profile_picture);
      }
    }
  }

  @Output() saveEvent = new EventEmitter<any>();

  @ViewChild('ngOtpInput', { static: false }) ngOtpInput: any;

  config = {
    allowNumbersOnly: false,
    length: 5,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '30px',
      'height': '30px',
      'font-size': '20px'
    }
  };

  constructor(
    private formModal: ModalController,
    private formBuilder: FormBuilder
  ) {
    this.userForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      dream_code: [],
      profile_picture: []
    });
  }

  onCancel() {
    this.formModal.dismiss(null, 'cancel');
  }

  getDirtyValues(form: FormGroup) {
    let dirtyValues: any = {};

    Object.keys(form.controls).forEach(key => {
      let currentControl = form.controls[key];
      if (currentControl.dirty) {
        dirtyValues[key] = currentControl.value;
      }
    });
    return dirtyValues;
  }

  onSubmit() {
    console.log("añaña", this.getDirtyValues(this.userForm))
    this.formModal.dismiss(this.getDirtyValues(this.userForm), 'submit');
  }

  onOtpChange(event: any) {
    // Handle OTP change here
  }
}
