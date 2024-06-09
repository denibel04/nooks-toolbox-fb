import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { User } from 'src/app/core/interfaces/user';
import { BehaviorSubject, Observable, Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { FirebaseAuthService } from 'src/app/core/services/api/firebase/firebase-auth.service';
import { UserService } from 'src/app/core/services/user.service';
import { TabViewModule } from 'primeng/tabview';
import { IonInput } from '@ionic/angular';
import { FirebaseService } from 'src/app/core/services/api/firebase/firebase.service';
import { IslandService } from 'src/app/core/services/island.service';

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
  public mutualUsers: User[] | undefined;

  public is: boolean = false;

  constructor(
    private fbSvc: FirebaseService,
    public fbAuth: FirebaseAuthService,
    public userSvc: UserService,
    public islandService: IslandService
  ) {
    this.fbAuth.user$.subscribe(user => {
      this._user.next(user);
      console.log("app user", this._user.value);
      if (user) {
        this.loadMutualUsers()
      }
    });

    this.userSvc.getPaginatedUsers().subscribe();

    this.islandService.getUserIsland().subscribe(is => {
      this.is = !!is;
    })
  }

  async onFilter(event: any) {
    if (event.detail.value === '') {
      this.filteredUsers = []
    } else {
      this.filteredUsers = await this.userSvc.getFiltered(event.detail.value)
    }
    console.log("filtered", this.filteredUsers, event)
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
      this.loadMutualUsers()
    });
  }

  onUnfollowClicked(user: User) {
    this.userSvc.unfollowUser(user, this._user.value!).subscribe()
    this.fbAuth.me().subscribe(data => {
      this._user.next(data);
      this.loadMutualUsers()
    });
  }



  async loadMutualUsers() {
    const mutualUserUuids = this._user.value!.following.filter(uuid => this._user.value!.followers.includes(uuid));
    const userPromises = mutualUserUuids.map(uuid => this.userSvc.getUserById(uuid));
    const users = await Promise.all(userPromises);

    this.mutualUsers = users.filter((user): user is User => user !== undefined);
  }

}
