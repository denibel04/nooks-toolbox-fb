import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Island } from 'src/app/core/interfaces/island';
import { AuthStrapiService } from 'src/app/core/services/api/strapi/auth-strapi.service';
import { IslandService } from 'src/app/core/services/island.service';
import { IslandFormComponent } from 'src/app/shared/components/island-form/island-form.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  _island: Island | null = null;

  constructor(
    public islandService: IslandService,
    public authService:AuthStrapiService,
    private modal: ModalController
  ) { }

  ngOnInit() {
    this.islandService.getUserIsland().subscribe()
  };


  async presentForm(data: Island | null, onDismiss: (result: any) => void) {
    const modal = await this.modal.create({
      component: IslandFormComponent,
      componentProps: {
        island: data
      }
    });
    modal.present();
    modal.onDidDismiss().then(result => {
      if (result && result.data) {
        onDismiss(result);
      }
    })
  }


  onNewIsland() {
    var onDismiss = async (info: any) => {
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
    this.presentForm(null, onDismiss);
  }


  onEditClicked(is: Island) {
    var onDismiss = (info: any) => {
      switch (info.role) {
        case 'submit': {
          // is.attributes.islandName = info.data.islandName
          // if (info.data.villagers) {
          //   is.attributes.villagers = info.data.villagers
          // }
          this.islandService.updateIsland(is, info).subscribe();
        }
          break;
        case 'delete': {
          this.islandService.deleteIsland(is).subscribe();
        }
          break;
        default: {
          console.error("Error")
        }
      }
    }
    this.presentForm(is, onDismiss);
  }

}
