import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { Pagination } from 'src/app/core/interfaces/data';
import { Villager } from 'src/app/core/interfaces/villager';
import { VillagerService } from 'src/app/core/services/villager.service';

@Component({
  selector: 'app-villagers',
  templateUrl: './villagers.page.html',
  styleUrls: ['./villagers.page.scss'],
})
export class VillagersPage implements OnInit {


  constructor(
    public villagerService:VillagerService,
    public modal:ModalController
  ) { }

  ngOnInit():void {
  }

doInfinite(event: any) {
  this.villagerService.getPaginatedVillagers().subscribe(() => {
    event.target.complete(); // Marcar el evento como completo para que esté listo para más datos
  });
}
}
