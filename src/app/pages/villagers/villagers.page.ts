import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
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

  ngOnInit() {
    this.villagerService.loadInitialVillagers();
  }

  loadMoreData(event: any) {
    this.villagerService.loadMoreVillagers();
    event.target.complete();  
  }

  

}
