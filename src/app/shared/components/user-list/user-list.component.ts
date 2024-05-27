import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { User } from 'src/app/core/interfaces/user';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent  implements OnInit {

  @Input() userUuids: string[] = [];
  @Input() listType:string = ""
  users: any[] = [];

  constructor(
    private modalController: ModalController,
    private userSvc: UserService
  ) { }

  ngOnInit() {
    this.loadUsers();
  }

  onCancel() {
    this.modalController.dismiss();
  }

  async loadUsers() {
    const userPromises = this.userUuids.map(uuid => this.userSvc.getUserById(uuid));
    this.users = await Promise.all(userPromises);
    console.log("users", this.users)
  }

}
