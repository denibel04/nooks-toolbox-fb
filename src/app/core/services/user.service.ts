import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase/firebase.service';
import { User } from '../interfaces/user';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private fbSvc: FirebaseService,
  ) { }

  lastUser : any = null

  private _users: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([])
  public users$: Observable<User[]> = this._users.asObservable();



// get paginated users
public getPaginatedUsers(): Observable<User[]> {
  console.log("getpag", this._users.value.length);
  return new Observable(observer => {
    this.fbSvc.getDocumentsPaginated("users", 25, "uuid", this.lastUser).then(usersPaginated => {
      console.log("paginated users", usersPaginated);
      const newUsers = usersPaginated.map(doc => {
        const data = doc.data;
        const user: User = {
          uuid: doc['id'],
          username: data['username'],
          display_name: data['display_name'],
          island: data['island'],
          profile_picture: data['profile_picture'],
          dream_code: data['dream_code'],
          role: data['role']
        };
        return user;
      });

      this.lastUser = newUsers[newUsers.length - 1].username;

      const currentUsers = this._users.value;
      const updatedUsers = [...currentUsers, ...newUsers];

      this._users.next(updatedUsers);
      observer.next(updatedUsers);
      observer.complete();
    });
  });
}

// update user

// delete user

}
