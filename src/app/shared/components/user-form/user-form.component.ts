

import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { User } from 'src/app/core/interfaces/user';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
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

   /**
   * Method to handle the cancel action.
   * Dismisses the modal without returning any data.
   */
  onCancel() {
    this.formModal.dismiss(null, 'cancel');
  }
 /**
   * Method to retrieve the dirty (modified) values from the form.
   * @param form The form group to extract dirty values from.
   * @returns An object containing the dirty values from the form.
   */
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
 /**
   * Method to handle the submit action.
   * Logs the dirty values from the form and dismisses the modal with the dirty values.
   */
  onSubmit() {
    console.log("añaña", this.getDirtyValues(this.userForm))
    this.formModal.dismiss(this.getDirtyValues(this.userForm), 'submit');
  }

}

