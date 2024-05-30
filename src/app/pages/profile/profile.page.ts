import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { User } from 'src/app/core/interfaces/user';
import { BehaviorSubject, Observable, Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { FirebaseAuthService } from 'src/app/core/services/api/firebase/firebase-auth.service';
import { FirebaseService } from 'src/app/core/services/firebase/firebase.service';
import { UserService } from 'src/app/core/services/user.service';
import { TabViewModule } from 'primeng/tabview';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProfilePage {
  protected _user = new BehaviorSubject<User | null>(null);
  public user$: Observable<User | null> = this._user.asObservable();

  public filteredUsers: User[] | undefined;

  otpValue: string = '123456';

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

  async onFilter(event: any) {
    if (event.detail.value === '') {
      this.filteredUsers = []
    } else {
      this.filteredUsers = await this.userSvc.getFiltered(event.detail.value)
    }
    console.log("filtered", this.filteredUsers, event)
  }
  onOtpChange(event:any) {
    console.log("otp",event)
  }

  async ngOnInit() {
    await this.loadUserDetails();
  }

  private async loadUserDetails() {
    try {
      if (this._user && this._user.value && this._user.value.uuid) {
        const userId = this._user.value.uuid;
        console.log("useruid", await this.userSvc.getUserById(userId));
      } else {
        console.error('User ID is not available');
      }
    } catch (error) {
      console.error('Error fetching user details', error);
    }
  }

  isUserFollowed(userUuid: any): boolean {
    return this._user.value!.following.includes(userUuid);
  }


  onFollowClicked(user: User) {
    this.userSvc.followUser(user, this._user.value!).subscribe();
    this.fbAuth.me().subscribe(data => {
      this._user.next(data);
    });
  }

  onUnfollowClicked(user: User) {
    this.userSvc.unfollowUser(user, this._user.value!).subscribe()
    this.fbAuth.me().subscribe(data => {
      this._user.next(data);
    });
  }
}
