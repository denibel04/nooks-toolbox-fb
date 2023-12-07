import { Component } from '@angular/core';
import { User } from './core/interfaces/user';
import { AuthService } from './core/services/api/strapi/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { CustomTranslateService } from './core/services/custom-translate.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  showNavbar:boolean = true;
  lang:string = "es";
  user:User|undefined = undefined;
  constructor(
    public auth:AuthService,
    private router:Router,
    public translate:CustomTranslateService
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showNavbar = !['/login', '/register'].includes(event.urlAfterRedirects);
      } });

    this.auth.isLogged$.subscribe(logged=>{
      
      if(logged){
        this.auth.me().subscribe(data=>{
          this.user = data;
        });
      }
    });
    this.translate.use(this.lang);
  }

  onSignOut(){
    this.auth.logout().subscribe(_=>{
      this.router.navigate(['/login']);
      this.user = undefined;
    });
  }

  
  onLang(lang:string){
    this.lang = lang;
    this.translate.use(this.lang);
    return false;    
  
  }
}
