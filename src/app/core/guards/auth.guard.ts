import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, delay, map, tap } from 'rxjs';
import { AuthService } from '../services/api/strapi/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private auth:AuthService,
    private router:Router){}
  canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.auth.isLogged$.pipe(map(logged=>{
        if(!logged) {
          console.log("no estás logueado");
        return this.router.createUrlTree(['/login']);
      } else {
        console.log("estás logueado");
        return true;}
      }));
  }
}
