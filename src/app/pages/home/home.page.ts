import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Island } from 'src/app/core/interfaces/island';
import { Villager } from 'src/app/core/interfaces/villager';
import { IslandService } from 'src/app/core/services/island.service';
import { IslandFormComponent } from 'src/app/shared/components/island-form/island-form.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public allVillagers = [];

  constructor(
    public islandService:IslandService,
    private router:Router,
    private modal:ModalController
  ) {}

  ngOnInit() {
    this.islandService.getAll().subscribe();
    
  };

  public villagers() {
    this.router.navigate(['/villagers'])
    
  }

  async presentForm(data: Island|null, onDismiss:(result:any) => void) {
    const modal = await this.modal.create ({
      component: IslandFormComponent,
      componentProps: {
        island:data
      }
    });
    modal.present();
    modal.onDidDismiss().then(result=> {
      if (result && result.data) {
        onDismiss(result);
      }
    })
  }

  
  onNewIsland() {
    var onDismiss = (info:any) => {
      switch (info.role) {
        case 'submit': {
          this.islandService.addIsland(info.data).subscribe();
        }
        break;
        default: {
          console.error("Error");
        } 
      }
    }
    this.presentForm(null,onDismiss);
  }


  onEditClicked(is:Island) {
    var onDismiss = (info:any) => {
      switch(info.role) {
        case 'submit' : {
          is.attributes.islandName = info.data.islandName
          this.islandService.updateIsland(is).subscribe();
        }
        break;
        case 'delete' : {
          this.islandService.deleteIsland(is).subscribe();
        }
        break;
        default: {
          console.error("Error")
        }
      }
    }
    this.presentForm(is,onDismiss);
  }

}
