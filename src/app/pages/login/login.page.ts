import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { UserCredentials } from 'src/app/core/interfaces/user-credentials';
import { UserRegisterInfo } from 'src/app/core/interfaces/user-register-info';
import { AuthService } from 'src/app/core/services/api/strapi/auth.service';
import { RegisterFormComponent } from 'src/app/shared/components/register-form/register-form.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    private auth:AuthService,
    private router:Router,
    private modal:ModalController
  ) { }

  ngOnInit() {
  }

  onLogin(credentials:UserCredentials){
    console.log("credentials: ", credentials)
    this.auth.login(credentials).subscribe({
      next:data=>{
        this.router.navigate(['home']);
      },
      error:err=>{
        console.log(err);
      }
    });
  }

  async presentForm(data:UserRegisterInfo|null, onDismiss:(result:any)=>void){
    
    const modal = await this.modal.create({
      component:RegisterFormComponent,
      componentProps:{
        user:data
      },
    });
    modal.present();
    modal.onDidDismiss().then(result=>{
      if(result && result.data){
        onDismiss(result);
      }
    });
  }

  onRegister(){
    var onDismiss = (info:any)=>{
      console.log(info);
      switch(info.role){
        case 'submit':{
          this.auth.register(info.data).subscribe()
        }
        break;
        default:{
          console.error("error");
        }
      }
    }
    this.presentForm(null, onDismiss);
  }

}
