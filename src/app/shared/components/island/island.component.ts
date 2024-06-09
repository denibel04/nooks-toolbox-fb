import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Island } from 'src/app/core/interfaces/island';
import { Villager } from 'src/app/core/interfaces/villager';

@Component({
  selector: 'app-island',
  templateUrl: './island.component.html',
  styleUrls: ['./island.component.scss'],
})
export class IslandComponent implements OnInit {

  @Input() island: Island | null = null;
  @Input() showEdit: boolean = false;


  @Output() onEditClicked: EventEmitter<void> = new EventEmitter<void>();

  constructor() {

  }

  ngOnInit() {
  }

  onEditClick(event: any) {
    this.onEditClicked.emit();
    console.log("click en editar")
  }


  getVillagersSlots():(Villager | null)[] {
    const placeholders = [];
    for (let i = 0; i < 10; i++) {
      if (this.island?.attributes.villagers && this.island?.attributes?.villagers[i]) 
        placeholders.push(this.island?.attributes.villagers[i])
      else
        placeholders.push(null);
    }
    return placeholders;
  }
}
