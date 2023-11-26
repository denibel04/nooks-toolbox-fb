import { Component } from '@angular/core';
import { User } from './core/interfaces/user';
import { AuthService } from './core/services/api/strapi/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  lang:string = "es";
  user:User|undefined = undefined;
  constructor(
    public auth:AuthService,
    private router:Router
  ) {
    this.auth.isLogged$.subscribe(logged=>{
      
      if(logged){
        this.auth.me().subscribe(data=>{
          this.user = data;
        });
        this.router.navigate(['/home']);
      }
    });
  }
 
  onSignOut(){
    this.auth.logout().subscribe(_=>{
      this.router.navigate(['/login']);
      this.user = undefined;
    });
  }
}
