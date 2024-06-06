import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, lastValueFrom, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { FirebaseAuthService } from '../services/api/firebase/firebase-auth.service';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

interface User {
  role: string; // Define la estructura de tu objeto de usuario aquí
}

@Injectable({
  providedIn: 'root'
})
export class BannedGuard implements CanActivate {

  constructor(
    private auth: FirebaseAuthService,
    private router: Router,
    private messageService: MessageService,
    private translate: TranslateService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    return this.auth.user$.pipe(
      map((user: User | null) => {
        if (user && user.role !== 'banned') {
          return true;
        }
        if (!user) {
          return this.handleUnauthenticated();
        }
        return this.handleBannedUser();
      }),
      catchError(() => of(this.router.createUrlTree(['/login'])))
    );
  }

  private handleBannedUser(): UrlTree {
    this.auth.logout().subscribe(async _=>{
      this.messageService.add({severity: 'error', summary: 'Error', detail: await lastValueFrom(this.translate.get('login.ban'))});
    });
    return this.router.createUrlTree(['/login']);
  }

  private handleUnauthenticated(): UrlTree {
    return this.router.createUrlTree(['/login']);
  }
}
