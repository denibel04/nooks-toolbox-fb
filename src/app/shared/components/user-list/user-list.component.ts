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

   /**
   * Initializes the user list by loading user data.
   */
  ngOnInit() {
    this.loadUsers();
  }
 /**
   * Method to handle the cancel action.
   * Dismisses the modal without returning any data.
   */
  onCancel() {
    this.modalController.dismiss();
  }
  /**
   * Asynchronous method to load user data based on the provided user UUIDs.
   * Fetches user data from the user service and stores it in the `users` array.
   */
  async loadUsers() {
    if (!this.userUuids || this.userUuids.length === 0) {
      this.users = [];
    } else {
      const userPromises = this.userUuids.map(uuid => this.userSvc.getUserById(uuid));
    this.users = await Promise.all(userPromises);
    console.log("users", this.users)
    }
    
  }

}
