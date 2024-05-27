import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent  implements OnInit {

  @Input() userUuids: string[] = [];

  constructor(
    private modalController: ModalController,
    private userSvc: UserService
  ) { }

  ngOnInit() {}

  onCancel() {
    this.modalController.dismiss();
  }

  

}
