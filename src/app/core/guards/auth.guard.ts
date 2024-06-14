import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, NavigationEnd, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, delay, map, tap } from 'rxjs';
import { AuthService } from '../services/api/strapi/auth.service';
import { FirebaseService } from '../services/api/firebase/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  /**
    * Constructor of AuthGuard.
    * @param auth Firebase authentication service.
    * @param router Angular router service.
    * @param activatedRoute The current activated route.
    */
  constructor(
    private auth: FirebaseService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }
  /**
  * Determines whether a route can be activated for authenticated users.
  * Authenticated users are allowed access and are redirected to their current activated route;
  * non-authenticated users are redirected to the login page.
  * @param route The route snapshot that is being activated.
  * @param state The router state snapshot.
  * @returns {Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree} 
  */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.auth.isLogged$.pipe(tap(logged => {
      if (!logged) {
        localStorage.setItem('returnUrl', state.url);
        return this.router.parseUrl('/login?returnUrl=' + state.url);
      }
      return true;
    }));
  }
}
