import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/core/interfaces/user';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
})
export class UserCardComponent  implements OnInit {

  constructor() { }
  @Input() user: User | null = null;


  ngOnInit() {}

}
