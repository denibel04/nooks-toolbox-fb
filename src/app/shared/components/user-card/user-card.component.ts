import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/core/interfaces/user';

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

  constructor() { }
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
        //this.editUser();
        break;
      case 'ban':
        //this.banUser();
        break;
      default:
        console.warn('Acción no reconocida:', this.buttonConfig.action);
    }
  }

}
