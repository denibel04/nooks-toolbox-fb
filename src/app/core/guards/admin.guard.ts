import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { FirebaseAuthService } from '../services/api/firebase/firebase-auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private auth:FirebaseAuthService,
    private router:Router
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      
      return this.auth.user$.pipe(
        map(user => {
          console.log("GUARDA ADMIN", user)
          if (!user || user.role !== 'admin') {
            localStorage.setItem('returnUrl', state.url); 
            return this.router.parseUrl('/login?returnUrl=' + state.url);
          }
          return true;
        })
      );
    }
}
