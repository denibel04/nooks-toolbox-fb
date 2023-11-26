import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, lastValueFrom, map, tap } from 'rxjs';
import { UserCredentials } from '../../../interfaces/user-credentials';
import { UserRegisterInfo } from '../../../interfaces/user-register-info';
import { JwtService } from './jwt.service';
import { ApiService } from '../api.service';
import { AuthService } from './auth.service';
import { StrapiExtendedUser, StrapiLoginPayload, StrapiLoginResponse, StrapiMe, StrapiRegisterPayload, StrapiRegisterResponse, StrapiResponse, StrapiUser } from '../../../interfaces/strapi';
import { User } from '../../../interfaces/user';

export class AuthStrapiService extends AuthService {

  constructor(
    private jwtSvc: JwtService,
    private apiSvc: ApiService
  ) {
    super();
    this.init();
  }

  private init() {
    this.jwtSvc.loadToken().subscribe(_ => {
      console.log(this.jwtSvc.getToken().toString())
      this._logged.next(true);
    }
    );
  }


  public login(credentials: UserCredentials): Observable<void> {
    return new Observable<void>(obs => {
      const _credentials: StrapiLoginPayload = {
        identifier: credentials.username,
        password: credentials.password
      };
      console.log("_Credentials: ", _credentials)
      this.apiSvc.post("/auth/local", _credentials).subscribe({
        next: async (data: StrapiLoginResponse) => {
          await lastValueFrom(this.jwtSvc.saveToken(data.jwt));
          this._logged.next(data && data.jwt != '');
          obs.next();
          obs.complete();
        },
        error: err => {
          obs.error(err);
        }
      });
    });
  }

  logout(): Observable<void> {
    return this.jwtSvc.destroyToken().pipe(map(_ => {
      this._logged.next(false);
      return;
    }));
  }

  register(info: UserRegisterInfo): Observable<void> {
    return new Observable<void>(obs => {
      const _info: StrapiRegisterPayload = {
        email: info.email,
        username: info.username,
        password: info.password
      }
      this.apiSvc.post("/auth/local/register", info).subscribe({
        next: async (data: StrapiRegisterResponse) => {
          let connected = data && data.jwt != '';
          this._logged.next(connected);
          await lastValueFrom(this.jwtSvc.saveToken(data.jwt));
          const _extended_user: StrapiExtendedUser = {
            data:{
              display_name: info.display_name,
              user_id: data.user.id,
              user: data.user.id
            }
          }
          await lastValueFrom(this.apiSvc.post("/extended-users", _extended_user)).catch;
          obs.next();
          obs.complete();
        },
        error: err => {
          obs.error(err);
        }
      });
    });
  }

  public me() {
    return new Observable<User>(obs => {
      this.apiSvc.get('/users/me').subscribe({
        next: async (user: StrapiMe) => {
          let extended_user = await lastValueFrom(this.apiSvc.get(`/extended-users?filters[user_id]=${user.id}`));
          let ret: User = {
            id: user.id,
            username: user.username,
            display_name: extended_user.data[0].attributes.display_name
          }
          obs.next(ret);
          obs.complete();
        },
        error: err => {
          obs.error(err);
        }
      });
    });

  }
}
