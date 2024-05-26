import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/core/interfaces/user';
import { UserFormComponent } from '../user-form/user-form.component';
import { ModalController } from '@ionic/angular';
import { UserService } from 'src/app/core/services/user.service';

interface ButtonConfig {
  text: string;
  action: string;
  color: string;
  fill: string;
}

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
})
export class UserCardComponent  implements OnInit {

  constructor(
    private modal: ModalController,
    private userSvc:UserService
  ) { }
  @Input() user: User | null  = null;
  @Input() buttonType: string = "";

  buttonConfig!: ButtonConfig;

  private readonly BUTTON_CONFIGS: { [key: string]: ButtonConfig } = {
    follow: {
      text: 'follow',
      action: 'follow',
      color: 'secondary',
      fill: 'solid'
    },
    unfollow: {
      text: 'undollow',
      action: 'unfollow',
      color: 'secondary',
      fill: 'outline'
    },
    edit: {
      text: 'edit',
      action: 'edit',
      color: 'primary',
      fill: 'solid'
    },
    ban: {
      text: 'ban',
      action: 'ban',
      color: 'danger',
      fill: 'solid'
    }
  };


  ngOnInit() {
    this.buttonConfig = this.BUTTON_CONFIGS[this.buttonType];
  }

  handleButtonClick() {
    switch (this.buttonConfig.action) {
      case 'follow':
        //this.followUser();
        break;
      case 'unfollow':
        //this.unfollowUser();
        break;
      case 'edit':
        this.onEditClicked(this.user!)
        break;
      case 'ban':
        //this.banUser();
        break;
      default:
        console.warn('Acción no reconocida:', this.buttonConfig.action);
    }
  }



  onEditClicked(user: User) {
    var onDismiss = (info: any) => {
      if (info.role == 'submit') {
        this.userSvc.updateUser(user, info);
        //this.isModalOpen = false;
      } else {
        //this.isModalOpen = false;
        console.error("Error")
      }
      /*switch (info.role) {
        case 'submit': {
          this.islandService.updateIsland(is, info).subscribe(is => {
            this.is = !!is;
            this.isModalOpen = false;
          })
          this.islandService.getUserIsland().subscribe();
        }
          break;
        case 'delete': {
          this.is = false;
          this.isModalOpen = false;
          console.log("delete")
          //this.loanService.deleteLoansOnCascade(is);
          this.islandService.deleteIsland(is).subscribe()
        }
          break;
        default: {
          this.isModalOpen = false;
          console.error("Error")
        }
      }*/
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
      if (result && result.data) {
        onDismiss(result);
      }
    })
  }



}
