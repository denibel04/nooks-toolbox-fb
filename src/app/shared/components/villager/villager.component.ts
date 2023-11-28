import { Component, Input, OnInit } from '@angular/core';
import { Villager } from 'src/app/core/interfaces/villager';

@Component({
  selector: 'app-villager',
  templateUrl: './villager.component.html',
  styleUrls: ['./villager.component.scss'],
})
export class VillagerComponent  implements OnInit {

  @Input() villager:any;

  constructor() { }

  ngOnInit():void {
  }

}
