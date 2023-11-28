import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Villager } from 'src/app/core/interfaces/villager';

@Component({
  selector: 'app-villager-item',
  templateUrl: './villager-item.component.html',
  styleUrls: ['./villager-item.component.scss'],
})
export class VillagerItemComponent  implements OnInit {

  private _villager:Villager|undefined;

  @Input('villager') set villager(_villager:Villager|undefined){
    this._villager = _villager
  }

  @Output('clicked') clicked = new EventEmitter();

  
  get villager():Villager|undefined{
    return this._villager;
  }


  constructor() { }

  ngOnInit() {}


  onVillagerClicked(){
    this.clicked.emit(this._villager);
  }

}
