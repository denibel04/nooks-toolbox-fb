import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Island } from 'src/app/core/interfaces/island';
import { Loan } from 'src/app/core/interfaces/loan';
import { AuthStrapiService } from 'src/app/core/services/api/strapi/auth-strapi.service';
import { IslandService } from 'src/app/core/services/island.service';
import { LoanService } from 'src/app/core/services/loan.service';
import { IslandFormComponent } from 'src/app/shared/components/island-form/island-form.component';
import { LoanFormComponent } from 'src/app/shared/components/loan-form/loan-form.component';
import { Geolocation } from '@capacitor/geolocation';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  is: boolean = false;
  isModalOpen = false
  currentPosition: any;

  constructor(
    public islandService: IslandService,
    public authService: AuthStrapiService,
    private modal: ModalController,
    public loanService: LoanService,
    private router: Router,
    private alertController: AlertController,
    private translate: TranslateService
  ) { }

  ngOnInit() { };

  ngAfterViewInit() {
    this.islandService.getUserIsland().subscribe(is => {
      this.is = !!is;
    })
    this.loanService.getUserLoans().subscribe()
  }

  public loans() {
    this.router.navigate(['/loans'])
  }

  async presentForm(data: Island | null, onDismiss: (result: any) => void) {
    const modal = await this.modal.create({
      component: IslandFormComponent,
      componentProps: {
        island: data
      }
    });
    modal.present();
    modal.onDidDismiss().then(result => {
      this.isModalOpen = false;
      if (result && result.data) {
        onDismiss(result);
      }
    })
  }


  async onNewIsland() {
    this.isModalOpen = true;
    var onDismiss = async (info: any) => {
      switch (info.role) {
        case 'submit': {
          this.hemisphereAlert(info.data);
          this.isModalOpen = false;
          console.log("data", info.data)
        }
          break;
        default: {
          this.isModalOpen = false;
          console.error("Error");
        }
      }
    }
    this.presentForm(null, onDismiss);
  }
  
  async hemisphereAlert(data: any) {
    let hemisphere = await this.getHemisphere();
    const alert = await this.alertController.create({
      mode: 'ios',
      header: await lastValueFrom(this.translate.get('island.hemisphere.confirm')),
      message: `${await lastValueFrom(this.translate.get('island.hemisphere.youarein'))} ${await lastValueFrom(this.translate.get(`island.hemisphere.${hemisphere}`))} ${await lastValueFrom(this.translate.get('island.hemisphere.continue'))}`,
      buttons: [
        {
          text: await lastValueFrom(this.translate.get('island.hemisphere.yes')),
          handler: () => {
            const isData = { ...data, hemisphere };
            this.islandService.getUserIsland().subscribe(updatedIsland => {
              this.is = !!updatedIsland
            });
            this.islandService.addIsland(isData).subscribe();
          },
        },
        {
          text: await lastValueFrom(this.translate.get('island.hemisphere.no')),
          handler: () => {
            if (hemisphere === 'north')
              hemisphere = 'south';
            else
              hemisphere = 'north';
            const isData = { ...data, hemisphere };
            console.log("is", isData);
            this.islandService.getUserIsland().subscribe(updatedIsland => {
              this.is = !!updatedIsland
            });
            this.islandService.addIsland(isData).subscribe();
          }
        },
      ],
    });
    await alert.present();
  }

  async getHemisphere(): Promise<string> {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      return coordinates.coords.latitude >= 0 ? 'north' : 'south';
    } catch (error) {
      console.error('Error obteniendo la geolocalización:', error);
      return 'unknown';
    }
  }


  onEditClicked(is: Island) {
    this.isModalOpen = true;
    var onDismiss = (info: any) => {
      switch (info.role) {
        case 'submit': {
          this.islandService.updateIsland(is, info).subscribe(is => {
            this.is = !!is;
            this.isModalOpen = false;
          })
          this.islandService.getUserIsland().subscribe();
        }
          break;
        case 'delete': {
          this.is = false;
          this.isModalOpen = false;
          console.log("delete")
          //this.loanService.deleteLoansOnCascade(is);
          this.islandService.deleteIsland(is).subscribe()
        }
          break;
        default: {
          this.isModalOpen = false;
          console.error("Error")
        }
      }
    }
    this.presentForm(is, onDismiss);
  }


  async presentLoanForm(data: Loan | null, onDismiss: (result: any) => void) {
    const modal = await this.modal.create({
      component: LoanFormComponent,
      componentProps: {
        loan: data
      }
    });
    modal.present();
    modal.onDidDismiss().then(result => {
      this.isModalOpen = false;
      if (result && result.data) {
        onDismiss(result);
      }
    })
  }
  onLoanClicked(loan: Loan) {
    this.isModalOpen = true;
    var onDismiss = (info: any) => {
      switch (info.role) {
        case 'submit': {
          loan.attributes = info.data
          this.loanService.updateLoan(loan).subscribe();
        }
          break;
        default: {
          console.error("Error")
        }
      }
    }
    this.presentLoanForm(loan, onDismiss);
  }

  onDeleteClicked(loan: Loan) {
    this.loanService.deleteLoan(loan).subscribe(deleted => { });
  }

}
