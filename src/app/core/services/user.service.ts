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

  lastUser: any = null

  private _users: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([])
  public users$: Observable<User[]> = this._users.asObservable();

  public getPaginatedUsers(): Observable<User[]> {
    console.log("getpag", this._users.value.length);
    return new Observable(observer => {
      this.fbSvc.getDocumentsPaginated("users", 25, "username", this.lastUser).then(usersPaginated => {
        console.log("paginated users", usersPaginated);
        const newUsers = usersPaginated.map(doc => {
          const data = doc.data;
          console.log("user data", data);
          if (data && data['username']) {
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
          } else {
            return undefined;
          }
        }).filter((user): user is User => user !== undefined); 
  
        if (newUsers.length > 0) {
          this.lastUser = newUsers[newUsers.length - 1].username;
        }
  
        const currentUsers = this._users.value;
        const updatedUsers = [...currentUsers, ...newUsers];
  
        this._users.next(updatedUsers);
        observer.next(updatedUsers);
        observer.complete();
      }).catch(error => {
        console.error('Error fetching paginated users:', error);
        observer.error(error);
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
      postdata.dream_code = info.data.dream_code || user.dream_code;
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
    } else if (user.profile_picture) {
      postdata.profile_picture = user.profile_picture;
    }

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

  followUser(userToFollow: User): Observable<void> {
    return new Observable(observer => {
      this.fbAuth.user$.subscribe(currentUser => {
        if (currentUser) {
          const newFollowing = [...currentUser.following, userToFollow.uuid];
          this.fbSvc.updateDocument('users', currentUser.uuid, { following: newFollowing }).then(() => {
            const newFollowers = [...userToFollow.followers, currentUser!.uuid];
            this.fbSvc.updateDocument('users', userToFollow.uuid, { followers: newFollowers }).then(() => {
              // Update local state
              this.updateLocalUsers(currentUser.uuid!, userToFollow.uuid!, true);
              observer.complete();
            });
          });
        } else {
          observer.error('No se encontró el usuario actual');
        }
      });
    });
  }
  

  unfollowUser(userToUnfollow: User): Observable<void> {
    return new Observable(observer => {
      this.fbAuth.user$.subscribe(currentUser => {
        if (currentUser) {
          const newFollowing = currentUser.following.filter(uuid => uuid !== userToUnfollow.uuid);
          this.fbSvc.updateDocument('users', currentUser.uuid, { following: newFollowing }).then(() => {
            const newFollowers = userToUnfollow.followers.filter(uuid => uuid !== currentUser!.uuid);
            this.fbSvc.updateDocument('users', userToUnfollow.uuid, { followers: newFollowers }).then(() => {
              // Update local state
              this.updateLocalUsers(currentUser.uuid!, userToUnfollow.uuid!, false);
              observer.complete();
            });
          });
        } else {
          observer.error('No se encontró el usuario actual');
        }
      });
    });
  }
  

private updateLocalUsers(currentUserId: string, targetUserId: string, isFollowing: boolean): void {
  const currentUsers = this._users.value;

  const updatedUsers = currentUsers.map(user => {
    if (user.uuid === currentUserId) {
      // Update following list of the current user
      return {
        ...user,
        following: isFollowing
          ? [...user.following, targetUserId]
          : user.following.filter(id => id !== targetUserId)
      };
    } else if (user.uuid === targetUserId) {
      // Update followers list of the target user
      return {
        ...user,
        followers: isFollowing
          ? [...user.followers, currentUserId]
          : user.followers.filter(id => id !== currentUserId)
      };
    }
    return user;
  });

  this._users.next(updatedUsers);
}


  //TODO get user by uuid

  //TODO get user by username

  //TODO delete/ban user

}
