import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from 'src/app/core/interfaces/user';
import { UserFormComponent } from '../user-form/user-form.component';
import { ModalController } from '@ionic/angular';
import { UserService } from 'src/app/core/services/user.service';
import { FirebaseAuthService } from 'src/app/core/services/api/firebase/firebase-auth.service';
import { UserListComponent } from '../user-list/user-list.component';

interface ButtonConfig {
  text: string;
  action: string;
  color: string;
  fill: string;
  icon: string,
  slot:string;
}

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
})
export class UserCardComponent  implements OnInit {

  constructor(
    private modal: ModalController,
    private userSvc:UserService,
    private fbAuth:FirebaseAuthService
  ) { }
  @Input() user: User | null  = null;
  @Input() buttonType: string = "";
  @Input() isMe: boolean = false;

  @Output() follow = new EventEmitter<User>();
  @Output() unfollow = new EventEmitter<User>();
  @Output() editModal = new EventEmitter<boolean>();

  buttonConfig!: ButtonConfig | null ;
  followersCount:number  = 0
  followingCount:number = 0;

  private readonly BUTTON_CONFIGS: { [key: string]: ButtonConfig } = {
    follow: {
      text: 'follow',
      action: 'follow',
      color: 'secondary',
      fill: 'solid',
      icon: 'person-add',
      slot: 'end'
    },
    unfollow: {
      text: 'unfollow',
      action: 'unfollow',
      color: 'secondary',
      fill: 'outline',
      icon: 'person-remove'  ,
      slot: 'end'
    },
    edit: {
      text: 'edit',
      action: 'edit',
      color: 'secondary',
      fill: 'solid',
      icon: 'pencil' ,
      slot: 'icon-only'
    },
    ban: {
      text: 'ban',
      action: 'ban',
      color: 'danger',
      fill: 'solid',
      icon: 'ban'  ,
      slot: 'start'
    }
  };
  


  ngOnInit() {
    if (this.buttonType == 'none') {
      this.buttonConfig = null
    } else {
      this.buttonConfig = this.BUTTON_CONFIGS[this.buttonType];
    }
    
    this.followersCount  = this.user?.followers ?  this.user!.followers.length : 0
    this.followingCount  = this.user?.following ?  this.user!.following.length : 0

  }

  handleButtonClick(event:any) {
    switch (this.buttonConfig?.action) {
      case 'follow':
        this.follow.emit(this.user!);
        this.buttonConfig =  this.BUTTON_CONFIGS['unfollow']
        this.followersCount! +=1
        break;
      case 'unfollow':
        this.unfollow.emit(this.user!)
        this.buttonConfig =  this.BUTTON_CONFIGS['follow']
        this.followersCount! -=1
      break;
      case 'edit':
        this.onEditClicked(this.user!)
        break;
      case 'ban':
        console.log("ban button")
        this.userSvc.banUser(this.user!).subscribe()
        break;
    }
    event.stopPropagation();
  }

  onEditClicked(user: User) {
    this.editModal.emit(true);
    var onDismiss = (info: any) => {
      if (info.role == 'submit') {
        this.userSvc.updateUser(user, info);
        this.editModal.emit(false);
      } else {
        this.editModal.emit(false);
        console.error("Error")
      }
    }
    this.presentUserForm(user, onDismiss);
  }

  async presentUserForm(data: User | null, onDismiss: (result: any) => void) {
    const modal = await this.modal.create({
      component: UserFormComponent,
      componentProps: {
        user: data
      }
    });
    modal.present();
    modal.onDidDismiss().then(result => {
      this.editModal.emit(false);
      if (result && result.data) {
        onDismiss(result);
      }
    })
  }

  async openUserListModal(listType: string,event:any) {
    event.stopPropagation();
    let userUuids: string[] | undefined;
  
    if (listType === "following") {
      userUuids = this.user?.following;
    } else {
      userUuids = this.user?.followers;
    }
  
    this.editModal.emit(true);
    const modal = await this.modal.create({
      component: UserListComponent,
      componentProps: {
        userUuids: userUuids,
        listType: listType
      }
    });
    modal.present();
    modal.onDidDismiss().then(_ => {
      this.editModal.emit(false);
    })
  }
  
}
