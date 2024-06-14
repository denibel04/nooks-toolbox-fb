import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { OverlayPanel } from 'primeng/overlaypanel';
import { BehaviorSubject } from 'rxjs';
import { Pagination } from 'src/app/core/interfaces/data';
import { Villager } from 'src/app/core/interfaces/villager';
import { VillagerService } from 'src/app/core/services/villager.service';

interface Item {
  label: string;
  index: number;
}

@Component({
  selector: 'app-villagers',
  templateUrl: './villagers.page.html',
  styleUrls: ['./villagers.page.scss'],
})
export class VillagersPage implements OnInit {
  items: Item[] = [];
  villagers: any[] | undefined;
  constructor(
    public villagerService: VillagerService,
    public modal: ModalController
  ) { }
  /**
   * Initialize component by fetching initial list of villagers.
   */
  ngOnInit(): void {
    this.villagerService.getPaginatedVillagers().subscribe()
}
  /**
   * Load more villagers on infinite scroll event.
   * @param event Event object from the infinite scroll.
   */
  doInfinite(event: any) {
    this.villagerService.getPaginatedVillagers().subscribe(() => {
      event.target.complete();
    });
  }

}
