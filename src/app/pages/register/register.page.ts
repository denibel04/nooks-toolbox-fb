import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserRegisterInfo } from 'src/app/core/interfaces/user-register-info';
import { FirebaseAuthService } from 'src/app/core/services/api/firebase/firebase-auth.service';
import { AuthService } from 'src/app/core/services/api/strapi/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {

  constructor(
    private auth: FirebaseAuthService,
    private router: Router,
  ) { }

  /**
    * Handles user registration.
    * @param info User registration information.
    */
  onRegister(info: UserRegisterInfo) {
    this.auth.register(info).subscribe({
      next: data => {
        this.router.navigate(['home']);
      },
      error: err => {
        console.log(err);
      }
    });

  }

}
