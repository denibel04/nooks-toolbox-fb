import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/core/interfaces/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { FirebaseAuthService } from 'src/app/core/services/api/firebase/firebase-auth.service';
import { FirebaseService } from 'src/app/core/services/firebase/firebase.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
  protected _user = new BehaviorSubject<User | null>(null);
  public user$: Observable<User | null> = this._user.asObservable();

  constructor(
    private fbSvc: FirebaseService,
    public fbAuth: FirebaseAuthService,
    public userSvc: UserService
  ) {
    this.fbAuth.user$.subscribe(user => {
      this._user.next(user);
      console.log("app user", this._user.value);
    });

    this.userSvc.getPaginatedUsers().subscribe();
  }

  isUserFollowed(userUuid: any): boolean {
    return this._user.value!.following.includes(userUuid);
  }


  onFollowClicked(user: User) {
    this.userSvc.followUser(user).subscribe(() => {
      this.fbAuth.me().subscribe(data => {
        this.fbAuth.updateProfilePictureAndUser(data);
      });
    });
  }

  onUnfollowClicked(user: User) {
    this.userSvc.unfollowUser(user).subscribe(() => {
      this.fbAuth.me().subscribe(data => {
        this.fbAuth.updateProfilePictureAndUser(data);
      });
    });
  }
}
