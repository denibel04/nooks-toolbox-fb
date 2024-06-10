import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { User } from 'src/app/core/interfaces/user';
import { BehaviorSubject, Observable, Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { FirebaseAuthService } from 'src/app/core/services/api/firebase/firebase-auth.service';
import { UserService } from 'src/app/core/services/user.service';
import { TabViewModule } from 'primeng/tabview';
import { IonInput } from '@ionic/angular';
import { FirebaseService } from 'src/app/core/services/api/firebase/firebase.service';
import { IslandService } from 'src/app/core/services/island.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Island } from 'src/app/core/interfaces/island';

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
  public currentIsland: Island | null = null;

  public isMe: boolean = true;

  constructor(
    private fbSvc: FirebaseService,
    public fbAuth: FirebaseAuthService,
    public userSvc: UserService,
    public islandService: IslandService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
   

    this.route.paramMap.subscribe(async params => {
      const userId = params.get('uuid');
      console.log("ppp init", userId)
      if (userId) {
        this.isMe = false;
        const user = await this.userSvc.getUserById(userId);
        if (user) {
          this._user.next(user);
          this.islandService.getUserIslandById(user.uuid!).subscribe(is =>{
            this.is = !!is;
            if (this.is) {
              this.currentIsland = is;
            }
          })
        }
      } else {
        this.fbAuth.user$.subscribe(user => {
          this._user.next(user);
          if (user) {
            this.loadMutualUsers()
            this.islandService.getUserIsland().subscribe(is => {
              this.is = !!is;
              if (this.is) {
                this.currentIsland = is;
              }
            })
          }
        });
      }
    });
  }

  async onFilter(event: any) {
    if (event.detail.value === '') {
      this.filteredUsers = []
    } else {
      this.filteredUsers = await this.userSvc.getFiltered(event.detail.value)
    }
  }

  async ngOnInit() {
    
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

  goToUserPage(user:any) {
    console.log("ppp", user)
    this.router.navigate(['/profile/' + user.uuid])
    
  }

}
