import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/core/interfaces/user';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  
  users$: Observable<User[]> | undefined;

  constructor(public userSvc: UserService) { }

  ngOnInit() {
    this.userSvc.getPaginatedUsers().subscribe();
  }
}
