import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, lastValueFrom } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { FirebaseAuthService } from '../services/api/firebase/firebase-auth.service';
import { FirebaseService } from '../services/firebase/firebase.service';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class BannedGuard implements CanActivate {

  constructor(
    private auth:FirebaseAuthService,
    private router:Router,
    private messageService: MessageService,
    private translate: TranslateService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      
      return this.auth.user$.pipe(
        map(user => {
          if (!user || user.role == 'banned') {
            this.auth.logout().subscribe(async _=>{
              this.messageService.add({severity: 'error', summary: 'Error', detail: await lastValueFrom(this.translate.get('login.ban'))});
              this.router.navigate(['/login']);
            });
            return false;
          }
          return true;
        })
      );
    }
}
