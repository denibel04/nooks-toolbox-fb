import { Injectable } from '@angular/core';
import { FirebaseService } from './api/firebase/firebase.service';
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

  public getAllUsers(): Observable<User[]> {
    return new Observable(observer => {
      this.fbSvc.getDocuments("users").then(documents => {
        const users = documents.map(doc => {
          const data = doc.data;
          const user: User = {
            uuid: doc['id'],
            username: data['username'],
            profile_picture: data['profile_picture'],
            dream_code: data['dream_code'],
            role: data['role'],
            followers: data['followers'],
            following: data['following']
          };
          return user;
        })
        observer.next(users);
        observer.complete();
      })
    })
  }

  public getPaginatedUsers(): Observable<User[]> {
    console.log("getpag", this._users.value.length);
    return new Observable(observer => {
      this.fbSvc.getDocumentsPaginated("users", 10, "username", this.lastUser).then(usersPaginated => {
        console.log("paginated users", usersPaginated);
        const newUsers = usersPaginated.map(doc => {
          const data = doc.data;
          console.log("user data", data);
          if (data && data['username']) {
            const user: User = {
              uuid: doc['id'],
              username: data['username'],
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

  followUser(userToFollow: User, currentUser: User): Observable<void> {
    return new Observable(observer => {
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
  }


  unfollowUser(userToUnfollow: User, currentUser: User): Observable<void> {
    return new Observable(observer => {
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
  }


  private updateLocalUsers(currentUserId: string, targetUserId: string, isFollowing: boolean): void {
    const currentUsers = this._users.value;

    const updatedUsers = currentUsers.map(user => {
      if (user.uuid === currentUserId) {
        return {
          ...user,
          following: isFollowing
            ? [...user.following, targetUserId]
            : user.following.filter(id => id !== targetUserId)
        };
      } else if (user.uuid === targetUserId) {
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

  public async getUserById(uid: string): Promise<User | undefined> {
    const doc = await this.fbSvc.getDocument("users", uid);
    if (doc) {
      const data = doc.data;
      return {
        uuid: doc.id,
        username: data['username'],
        island: data['island'],
        profile_picture: data['profile_picture'],
        dream_code: data['dream_code'],
        role: data['role'],
        followers: data['followers'],
        following: data['following']
      };
    } else {
      return undefined;
    }
  }

  public async getFiltered(username: string): Promise<User[]> {

    const usersFiltered = await this.fbSvc.getDocumentsFiltered("users", "username", username);
    console.log("gf", usersFiltered)

    const users: User[] = [];

    usersFiltered.forEach(doc => {
      const data = doc.data;
      const user: User = {
        uuid: doc.id,
        username: data['username'],
        island: data['island'],
        profile_picture: data['profile_picture'],
        dream_code: data['dream_code'],
        role: data['role'],
        followers: data['followers'],
        following: data['following']
      };
      users.push(user);
    });
    return users;
  }
}  
