import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Island } from 'src/app/core/interfaces/island';
import { AuthStrapiService } from 'src/app/core/services/api/strapi/auth-strapi.service';
import { IslandService } from 'src/app/core/services/island.service';
import { LoanService } from 'src/app/core/services/loan.service';
import { IslandFormComponent } from 'src/app/shared/components/island-form/island-form.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  is:boolean = false;

  constructor(
    public islandService: IslandService,
    public authService:AuthStrapiService,
    private modal: ModalController,
    private loanService:LoanService
  ) { }

  ngOnInit() {
    this.islandService.getUserIsland().subscribe(is=>{
      this.is = !!is;
    })
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
          this.islandService.updateIsland(is, info).subscribe();
        }
          break;
        case 'delete': {
          console.log("delete")
          this.loanService.deleteLoansOnCascade(is);
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
