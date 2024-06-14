import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from 'src/app/core/interfaces/user';
import { UserFormComponent } from '../user-form/user-form.component';
import { ModalController } from '@ionic/angular';
import { UserService } from 'src/app/core/services/user.service';
import { FirebaseAuthService } from 'src/app/core/services/api/firebase/firebase-auth.service';
import { UserListComponent } from '../user-list/user-list.component';

/**
 * Interface for button configuration used in UserCardComponent.
 */
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

  /**
   * Defines the button configurations available for the card.
   * Each key corresponds to a button type with its respective configuration.
   */
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
  

/**
   * Initializes the component and sets the configuration of the button
   */
  ngOnInit() {
    if (this.buttonType == 'none') {
      this.buttonConfig = null
    } else {
      this.buttonConfig = this.BUTTON_CONFIGS[this.buttonType];
    }
    

  }
/**
   * Handles button click events on the card.
   * Emits follow, unfollow, edit, or ban actions based on the buttonConfig.
   * @param event The click event object.
   */
  handleButtonClick(event:any) {
    switch (this.buttonConfig?.action) {
      case 'follow':
        this.follow.emit(this.user!);
        this.buttonConfig =  this.BUTTON_CONFIGS['unfollow']
        break;
      case 'unfollow':
        this.unfollow.emit(this.user!)
        this.buttonConfig =  this.BUTTON_CONFIGS['follow']
      break;
      case 'edit':
        this.onEditClicked(this.user!)
        break;
      case 'ban':
        this.userSvc.banUser(this.user!).subscribe()
        break;
    }
    event.stopPropagation();
  }

    /**
   * Handles the edit button click event.
   * Emits editModal event to open the user edit modal.
   * @param user The user object to edit.
   */
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

   /**
   * Presents the user form modal for editing user details.
   * @param data The initial user data to populate the form.
   * @param onDismiss Callback function when the modal is dismissed.
   */
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

  /**
   * Opens a modal to display the list of followers or following users.
   * @param listType The type of list to open ('followers' or 'following').
   * @param event The click event object.
   */
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
