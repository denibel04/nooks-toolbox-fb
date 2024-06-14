import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { UserCredentials } from 'src/app/core/interfaces/user-credentials';
import { UserRegisterInfo } from 'src/app/core/interfaces/user-register-info';
import { FirebaseAuthService } from 'src/app/core/services/api/firebase/firebase-auth.service';
import { AuthService } from 'src/app/core/services/api/strapi/auth.service';
import { RegisterFormComponent } from 'src/app/shared/components/register-form/register-form.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  constructor(
    private auth: FirebaseAuthService,
    private router:Router,
    private modal:ModalController
  ) { }

/**
   * Handles the login process using provided user credentials.
   * @param credentials UserCredentials object containing username and password.
   */
    onLogin(credentials:UserCredentials){
      this.auth.login(credentials).subscribe({
        next:data=>{
          console.log("login page data", data)
        },
        error:err=>{
          console.log(err);
        }
      });
    }

}
