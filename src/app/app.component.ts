import { Component } from '@angular/core';
import { User } from './core/interfaces/user';
import { AuthService } from './core/services/api/strapi/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { CustomTranslateService } from './core/services/custom-translate.service';
import { FirebaseAuthService } from './core/services/api/firebase/firebase-auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  showNavbar:boolean = true;
  lang:string = "es";
  user:User|null = null;
  constructor(
    public auth:AuthService,
    private router:Router,
    public translate:CustomTranslateService,
    public fbAuth: FirebaseAuthService,
  ) {

    const returnUrl = localStorage.getItem('returnUrl');
    if (returnUrl && this.auth.isLogged$) {
      localStorage.removeItem('returnUrl');
      this.router.navigateByUrl(returnUrl);
    }
    this.fbAuth.user$.subscribe(user => {
      this.user =user;
      if(user?.role == 'banned') {
        this.onSignOut();
      }
      
    })
    this.lang = this.translate.getBrowserLang();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showNavbar = !['/login', '/register'].includes(event.urlAfterRedirects);
      } });
  }

  /**
   * Handles the sign-out process.
   * Calls the logout method from AuthService, navigates to the login page, and sets the user to null.
   */
  onSignOut(){
    this.auth.logout().subscribe(_=>{
      this.router.navigate(['/login']);
      this.user = null;
    });
  }
    /**
   * Changes the application language.
   * Updates the language using CustomTranslateService and sets the new language.
   * @param lang The new language to set.
   */
  onLang(lang:string){
    this.lang = lang;
    this.translate.use(this.lang);
    return false;    
  }
}
