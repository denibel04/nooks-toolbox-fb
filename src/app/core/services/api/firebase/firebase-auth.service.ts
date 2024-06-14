import { Observable, from, lastValueFrom, map } from 'rxjs';
import { UserCredentials } from '../../../interfaces/user-credentials';
import { UserRegisterInfo } from '../../../interfaces/user-register-info';
import { User } from '../../../interfaces/user';
import { AuthService } from '../auth.service';
import { FirebaseService, FirebaseUserCredential } from './firebase.service';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthService extends AuthService {
  loadUser() {
    throw new Error('Method not implemented.');
  }

  constructor(
    private firebaseSvc: FirebaseService,
    private messageService: MessageService,
    private translate: TranslateService
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

  /**
 * Logs in a user with provided credentials.
 * @param credentials The user credentials containing username and password.
 * @returns {Observable<any>}
 */
  public login(credentials: UserCredentials): Observable<any> {
    return new Observable<any>(subscr => {
      this.firebaseSvc.connectUserWithEmailAndPassword(credentials.username, credentials.password).then((credentials: FirebaseUserCredential | null) => {
        if (!credentials || !credentials.user || !credentials.user.user || !credentials.user.user.uid) {
          subscr.error('Cannot login');
          return;
        }
        if (credentials) {
          this.me().subscribe(async data => {
            console.log("login data", data);
            if (data.role === 'banned') {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: await lastValueFrom(this.translate.get('login.ban')) });
              this._logged.next(false);
              this.logout().subscribe(() => {
                subscr.error('User is banned');
              });
            } else {
              this._user.next(data);
              this._logged.next(true);
              subscr.next(data);
              subscr.complete();
            }
          });
        }
      });
    });
  }

  /**
     * Registers a new user with provided registration information.
     * @param info The registration information containing email, password, and username.
     * @returns {Observable<any | null>}
     */
  public register(info: UserRegisterInfo): Observable<any | null> {
    return new Observable<any>(subscr => {
      this.firebaseSvc.createUserWithEmailAndPassword(info.email, info.password).then((credentials: FirebaseUserCredential | null) => {
        if (!credentials || !credentials.user || !credentials.user.user || !credentials.user.user.uid)
          subscr.error('Cannot register');
        if (credentials) {
          var _info: User = {
            ...info,
            role: 'normal',
            followers: [],
            following: []
          };
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

  /**
* Completes user registration after creating the user in Firebase.
* @param info Additional user information to be stored in the database.
* @returns  {Observable<any>}
*/
  private postRegister(info: User): Observable<any> {
    if (info.uuid)
      return from(this.firebaseSvc.createDocumentWithId('users', {
        username: info.username,
        role: 'normal',
        followers: [],
        following: []
      }, info.uuid))
    throw new Error('Error inesperado');
  }

  /**
   * Retrieves the current authenticated user's information.
   * @returns  {Observable<User>}
   * @throws Error if the user is not connected.
   */
  public me(): Observable<User> {
    if (this.firebaseSvc.user?.uid)
      return from(this.firebaseSvc.getDocument('users', this.firebaseSvc.user.uid)).pipe(map(data => {
        return {
          profile_picture: data.data['profile_picture'],
          username: data.data['username'],
          dream_code: data.data['dream_code'],
          role: data.data['role'],
          uuid: data.id,
          followers: data.data['followers'],
          following: data.data['following']
        }
      }));
    else
      throw new Error('User is not connected');
  }

  /**
   * Logs out the current user.
   * @returns {Observable<any>}
   */
  public logout(): Observable<any> {
    return from(this.firebaseSvc.signOut(false));
  }

  /**
* Updates the profile picture and user information.
* @param updatedUser The updated user information.
*/
  updateProfilePictureAndUser(updatedUser: User) {
    this._user.next(updatedUser);
  }

}
