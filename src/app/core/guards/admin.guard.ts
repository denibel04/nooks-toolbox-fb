import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { FirebaseAuthService } from '../services/api/firebase/firebase-auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

/**
   * Constructor of AdminGuard.
   * @param auth  Firebase authentication service.
   * @param router  Angular router service.
   */
  constructor(
    private auth:FirebaseAuthService,
    private router:Router
  ) {}

  /**
   * Determines whether a route can be activated.
   * Admin users are allowed access; non-admin users are redirected to login.
   * @param route The route snapshot that is being activated.
   * @param state The router state snapshot.
   * @returns {Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree} 
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      
      return this.auth.user$.pipe(
        map(user => {
          if (!user || user.role !== 'admin') {
            localStorage.setItem('returnUrl', state.url); 
            return this.router.parseUrl('/home');
          }
          return true;
        })
      );
    }
}
