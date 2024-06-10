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


 
  ngOnInit(): void {
    for (let i = 0; i < 100; i++) {
        this.items.push({ label: 'Item #' + i, index: i });
    }
    this.villagerService.getPaginatedVillagers().subscribe()
}
  doInfinite(event: any) {
    this.villagerService.getPaginatedVillagers().subscribe(() => {
      event.target.complete();
    });
  }

  @ViewChild('overlayPanel') overlayPanel!: OverlayPanel;

  showOverlayPanel(event: Event) {
    // Mostrar el panel superpuesto
    this.overlayPanel.toggle(event);
  }
}
