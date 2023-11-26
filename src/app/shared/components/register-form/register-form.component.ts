import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { UserRegisterInfo } from 'src/app/core/interfaces/user-register-info';

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
      display_name:['', [Validators.required]],
      email:['', [Validators.required]],
      password:['', [Validators.required]]
    });
  }

  ngOnInit() {}

  onSubmit(){
    this.onsubmit.emit(this.form.value);
  } 

}
