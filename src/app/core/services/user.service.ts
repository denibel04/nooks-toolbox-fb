import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase/firebase.service';
import { User } from '../interfaces/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { FirebaseAuthService } from './api/firebase/firebase-auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private fbSvc: FirebaseService,
    private fbAuth: FirebaseAuthService
  ) { }

  lastUser : any = null

  private _users: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([])
  public users$: Observable<User[]> = this._users.asObservable();



// get paginated users
public getPaginatedUsers(): Observable<User[]> {
  console.log("getpag", this._users.value.length);
  return new Observable(observer => {
    this.fbSvc.getDocumentsPaginated("users", 25, "username", this.lastUser).then(usersPaginated => {
      console.log("paginated users", usersPaginated);
      const newUsers = usersPaginated.map(doc => {
        const data = doc.data;
        console.log("user data", data)
        const user: User = {
          uuid: doc['id'],
          username: data['username'],
          display_name: data['display_name'],
          island: data['island'],
          profile_picture: data['profile_picture'],
          dream_code: data['dream_code'],
          role: data['role'],
          followers: data['followers'],
          following: data['following']
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

public async updateUser(user: User, info: any): Promise<Observable<User>> {
  console.log("update user", user, info);
  let postdata: any = {
    username: info.data.username || user.username,
    role: user.role
  };

  if (info.data.dream_code || user.dream_code) {
    postdata.dream_code =  info.data.dream_code || user.dream_code;
  }

  if (info.data.profile_picture) {
    const file: File = info.data.profile_picture;
    try {
      const url = await this.fbSvc.imageUpload(file);
      console.log("file", url);
      if (user.profile_picture) {
        await this.fbSvc.deleteFile(user.profile_picture);
      }
      postdata.profile_picture = url.file;
    } catch (error) {
      console.error('Error al subir la nueva imagen:', error);
      throw error;
    }
  } else if(user.profile_picture) {
    postdata.profile_picture = user.profile_picture;
  }

  console.log("postdata", postdata);

  try {
    await this.fbSvc.updateDocument('users', user.uuid, postdata);
    this.fbAuth.me().subscribe(updatedUser => {
      this.fbAuth.updateProfilePictureAndUser(updatedUser);
    });
    return new Observable(observer => {
      observer.complete();
    });
  } catch (error) {
    console.error('Error al actualizar el documento del usuario:', error);
    throw error;
  }
}


//TODO get user by uuid

//TODO get user by username

//TODO delete/ban user

}
