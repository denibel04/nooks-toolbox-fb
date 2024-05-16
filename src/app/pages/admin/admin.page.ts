import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {

  constructor(
    public userSvc: UserService
  ) { }

  ngOnInit() {
    this.userSvc.getPaginatedUsers().subscribe();
  }

}
