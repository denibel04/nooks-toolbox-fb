import { Observable, from, map } from 'rxjs';
import { UserCredentials } from '../../../interfaces/user-credentials';
import { UserRegisterInfo } from '../../../interfaces/user-register-info';
import { User } from '../../../interfaces/user';
import { AuthService } from '../auth.service';
import { FirebaseService, FirebaseUserCredential } from '../../firebase/firebase.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthService extends AuthService {

  constructor(
    private firebaseSvc: FirebaseService
  ) {
    super();
    this.firebaseSvc.isLogged$.subscribe(logged => {
      if (logged) {
        this.me().subscribe({
          next: data => {
            this._user.next(data);
            this._logged.next(true);
          },
          error: err => {
            console.log(err);
          }
        });
      }
      else {
        this._logged.next(false);
        this._user.next(null);
      }
    })
  }

  public login(credentials: UserCredentials): Observable<any> {
    return new Observable<any>(subscr => {
      this.firebaseSvc.connectUserWithEmailAndPassword(credentials.username, credentials.password).then((credentials: FirebaseUserCredential | null) => {
        if (!credentials || !credentials.user || !credentials.user.user || !credentials.user.user.uid) {
          subscr.error('Cannot login');
        }
        if (credentials) {
          this.me().subscribe(data => {
            this._user.next(data);
            this._logged.next(true);
            subscr.next(data);
            subscr.complete();
          });
        }
      })
    });
  }

  public register(info: UserRegisterInfo): Observable<any | null> {
    return new Observable<any>(subscr => {
      this.firebaseSvc.createUserWithEmailAndPassword(info.email, info.password).then((credentials: FirebaseUserCredential | null) => {
        if (!credentials || !credentials.user || !credentials.user.user || !credentials.user.user.uid)
          subscr.error('Cannot register');
        if (credentials) {
          var _info: User = { ...info };
          _info.uuid = this.firebaseSvc.user?.uid;
          this.postRegister(_info).subscribe(data => {
            this._user.next(_info);
            this._logged.next(true);
            subscr.next(_info);
            subscr.complete()
          });
        }
      })
    });
  }

  private postRegister(info: User): Observable<any> {
    if (info.uuid)
      return from(this.firebaseSvc.createDocumentWithId('users', {
        username: info.username,
        display_name: info.display_name,
        profile_picture: info.profile_picture
      }, info.uuid))
    throw new Error('Error inesperado');
  }

  public me(): Observable<User> {
    if (this.firebaseSvc.user?.uid)
      return from(this.firebaseSvc.getDocument('users', this.firebaseSvc.user.uid)).pipe(map(data => {
        console.log("GET DOCUMETS ME")
        return {
          profile_picture: data.data['profile_picture'],
          username: data.data['username'],
          display_name: data.data['display_name'],
          uuid: data.id
        }
      }));
    else
      throw new Error('User is not connected');
  }

  public logout(): Observable<any> {
    return from(this.firebaseSvc.signOut(false));
  }
}
