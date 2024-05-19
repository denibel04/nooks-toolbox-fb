import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { User } from 'src/app/core/interfaces/user';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent  implements OnInit {

  form:FormGroup;

  @Input() set user(_user: User | null) {
    if (_user) {
      this.form.controls['username'].setValue(_user.username);
      this.form.controls['username'].setValue(_user.username);
      this.form.controls['username'].setValue(_user.username);

    }
  }


  constructor(
    private formBuilder:FormBuilder
  ) { 
    this.form = this.formBuilder.group({
      username:[]
    })
  }

  ngOnInit() {}

}
