import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Island } from 'src/app/core/interfaces/island';
import { Villager } from 'src/app/core/interfaces/villager';

@Component({
  selector: 'app-island',
  templateUrl: './island.component.html',
  styleUrls: ['./island.component.scss'],
})
export class IslandComponent {

  @Input() island: Island | null = null;
  @Input() showEdit: boolean = false;


  @Output() onEditClicked: EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  /**
    * Handler for edit button click.
    * Emits `onEditClicked` event to notify parent component.
    * @param event Click event object
    */
  onEditClick(event: any) {
    this.onEditClicked.emit();
  }

  /**
    * Generates an array representing slots for villagers on the island.
    * If island has villagers, fills the slots with villagers; otherwise, fills with null.
    * @returns An array of Villager | null representing villagers slots.
    */
  getVillagersSlots(): (Villager | null)[] {
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
