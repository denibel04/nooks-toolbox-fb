import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, NavigationEnd, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, delay, map, tap } from 'rxjs';
import { AuthService } from '../services/api/strapi/auth.service';
import { FirebaseService } from '../services/api/firebase/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
 
  constructor(
    private auth:FirebaseService,
    private router:Router,
    private activatedRoute: ActivatedRoute
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.auth.isLogged$.pipe(tap(logged => {
      console.log("GUARDA", logged)
      if(!logged) {
        localStorage.setItem('returnUrl', state.url); 
        return this.router.parseUrl('/login?returnUrl=' + state.url);
      }
      return true;
    }));
  }
}
